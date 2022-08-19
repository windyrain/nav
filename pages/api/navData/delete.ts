// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getJsonData, updateNavData } from './query';
import { DATA_TYPE } from './type';

type ReqBody = {
    type?: string;
    departmentName?: string;
    categoryName?: string;
    navName?: string;
};

type ResData = {
    code: number;
    message: string;
    data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
    const { type, departmentName, categoryName, navName } = req.body as ReqBody;

    if (typeof type === 'undefined') {
        res.status(200).json({ code: -1, message: '删除类型有误' });
        return;
    }

    if (Number(type) === DATA_TYPE.Department) {
        return deleteDepartment(req, res, departmentName);
    }

    if (Number(type) === DATA_TYPE.Category) {
        return deleteCategory(req, res, { departmentName, categoryName });
    }

    if (Number(type) === DATA_TYPE.Nav) {
        return deleteNav(req, res, { departmentName, categoryName, navName });
    }
}

function deleteDepartment(req: NextApiRequest, res: NextApiResponse<ResData>, departmentName: string = '') {
    const navData = getJsonData();
    const departmentIndex = navData.findIndex(({ name }) => name === departmentName);

    if (departmentIndex === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，删除失败' });
        return;
    }

    navData.splice(departmentIndex, 1);

    updateNavData(navData);
    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));

    res.status(200).json({ code: 0, message: '删除成功' });
}

function deleteCategory(
    req: NextApiRequest,
    res: NextApiResponse<ResData>,
    data: {
        departmentName?: string;
        categoryName?: string;
    },
) {
    const navData = getJsonData();
    const { departmentName = '', categoryName = '' } = data;

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，删除失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，删除失败' });
        return;
    }

    const index = navData.findIndex(({ name }) => name === departmentName);

    if (index === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，删除失败' });
        return;
    }

    const categoryIndex = navData[index].categorys.findIndex(({ name }) => name === categoryName);

    if (categoryIndex === -1) {
        res.status(200).json({ code: -1, message: '分类名称不存在，删除失败' });
        return;
    }

    navData[index].categorys.splice(categoryIndex, 1);

    updateNavData(navData);
    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));

    res.status(200).json({ code: 0, message: '删除成功' });
}

function deleteNav(
    req: NextApiRequest,
    res: NextApiResponse<ResData>,
    data: {
        departmentName?: string;
        categoryName?: string;
        navName?: string;
    },
) {
    const navData = getJsonData();
    const { departmentName = '', categoryName = '', navName } = data;

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，删除失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，删除失败' });
        return;
    }

    if (!navName) {
        res.status(200).json({ code: -1, message: '导航名称为空，删除失败' });
        return;
    }

    const index = navData.findIndex(({ name }) => name === departmentName);

    if (index === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，删除失败' });
        return;
    }

    const categoryIndex = navData[index].categorys.findIndex(({ name }) => name === categoryName);

    if (categoryIndex === -1) {
        res.status(200).json({ code: -1, message: '分类名称不存在，删除失败' });
        return;
    }

    const navIndex = navData[index].categorys[categoryIndex].infos.findIndex(({ name }) => name === navName);

    if (navIndex === -1) {
        res.status(200).json({ code: -1, message: '导航名称不存在，删除失败' });
        return;
    }

    navData[index].categorys[categoryIndex].infos.splice(navIndex, 1);

    updateNavData(navData);
    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));

    res.status(200).json({ code: 0, message: '删除成功' });
}
