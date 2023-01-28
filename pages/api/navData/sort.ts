// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { arrayMove } from '@dnd-kit/sortable';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getJsonData, updateNavData } from './query';

type ReqBody = {
    departmentName?: string;
    categoryName?: string;
    sortIndexs: number[];
};

type ResData = {
    code: number;
    message: string;
    data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
    const token = await getToken({ req, raw: true });

    if (!token) {
        res.status(401).json({ code: -1, message: '无访问权限，请先登录' });
        return;
    }

    const { departmentName, categoryName, sortIndexs } = req.body as ReqBody;

    const navData = getJsonData();

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，交换失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，交换失败' });
        return;
    }

    const index = navData.findIndex(({ name }) => name === departmentName);

    if (index === -1) {
        res.status(200).json({ code: -1, message: '部门不存在' });
        return;
    }

    const { categorys } = navData[index];
    const categoryIndex = categorys.findIndex(({ name }) => name === categoryName);

    if (categoryIndex === -1) {
        res.status(200).json({ code: -1, message: '分类不存在' });
        return;
    }

    const infos = navData[index].categorys[categoryIndex].infos;
    const next = arrayMove(infos, sortIndexs[0], sortIndexs[1]);
    navData[index].categorys[categoryIndex].infos = next;
    updateNavData(navData);

    res.status(200).json({ code: 0, message: '交换成功' });
}
