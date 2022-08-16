// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import navData from '../../../data/data.json';
import { DATA_TYPE } from './type';

interface UpdateInfo {
    departmentName?: string;
    categoryName?: string;
    navName?: string;
    navUrl?: string;
    navUrls?: Array<{ env: string; url: string }>;
}

type ReqBody = {
    type?: string;
    departmentName?: string;
    categoryName?: string;
    navName?: string;
    updateInfo?: UpdateInfo;
};

type ResData = {
    code: number;
    message: string;
    data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
    const { type, departmentName, categoryName, navName, updateInfo } = req.body as ReqBody;

    if (typeof type === 'undefined') {
        res.status(200).json({ code: -1, message: '更新类型有误' });
        return;
    }

    if (Number(type) === DATA_TYPE.Department) {
        return updateDepartment(req, res, { departmentName, updateInfo });
    }

    if (Number(type) === DATA_TYPE.Category) {
        return updateCategory(req, res, { departmentName, categoryName, updateInfo });
    }

    if (Number(type) === DATA_TYPE.Nav) {
        return updateNav(req, res, { departmentName, categoryName, navName, updateInfo });
    }
}

function updateDepartment(
    req: NextApiRequest,
    res: NextApiResponse<ResData>,
    data: {
        departmentName?: string;
        updateInfo?: UpdateInfo;
    },
) {
    const { departmentName, updateInfo } = data;

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，更新失败' });
        return;
    }

    if (!updateInfo || !updateInfo?.departmentName) {
        res.status(200).json({ code: -1, message: '更新信息不存在，更新失败' });
        return;
    }

    const { departmentName: newDepartmentName } = updateInfo;
    const departmentIndex = navData.findIndex(({ name }) => name === departmentName);

    if (departmentIndex === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，更新失败' });
        return;
    }

    navData[departmentIndex].name = newDepartmentName;

    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));

    res.status(200).json({ code: 0, message: '更新成功' });
}

function updateCategory(
    req: NextApiRequest,
    res: NextApiResponse<ResData>,
    data: {
        departmentName?: string;
        categoryName?: string;
        updateInfo?: UpdateInfo;
    },
) {
    const { departmentName = '', categoryName = '', updateInfo } = data;

    if (!updateInfo || !updateInfo.departmentName || !updateInfo.categoryName) {
        res.status(200).json({ code: -1, message: '更新信息不存在，更新失败' });
        return;
    }

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，更新失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，更新失败' });
        return;
    }

    const index = navData.findIndex(({ name }) => name === departmentName);

    if (index === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，更新失败' });
        return;
    }

    const categoryIndex = navData[index].categorys.findIndex(({ name }) => name === categoryName);

    if (categoryIndex === -1) {
        res.status(200).json({ code: -1, message: '分类名称不存在，更新失败' });
        return;
    }

    navData[index].categorys[categoryIndex].name = updateInfo.categoryName;

    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));

    res.status(200).json({ code: 0, message: '更新成功' });
}

function updateNav(
    req: NextApiRequest,
    res: NextApiResponse<ResData>,
    data: {
        departmentName?: string;
        categoryName?: string;
        navName?: string;
        updateInfo?: UpdateInfo;
    },
) {
    const { departmentName = '', categoryName = '', navName, updateInfo } = data;

    if (
        !updateInfo ||
        !updateInfo.departmentName ||
        !updateInfo.categoryName ||
        !updateInfo.navName ||
        !updateInfo.navUrl
    ) {
        res.status(200).json({ code: -1, message: '更新信息不存在，更新失败' });
        return;
    }

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，更新失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，更新失败' });
        return;
    }

    if (!navName) {
        res.status(200).json({ code: -1, message: '导航名称为空，更新失败' });
        return;
    }

    const index = navData.findIndex(({ name }) => name === departmentName);

    if (index === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，更新失败' });
        return;
    }

    const categoryIndex = navData[index].categorys.findIndex(({ name }) => name === categoryName);

    if (categoryIndex === -1) {
        res.status(200).json({ code: -1, message: '分类名称不存在，更新失败' });
        return;
    }

    const navIndex = navData[index].categorys[categoryIndex].infos.findIndex(({ name }) => name === navName);

    if (navIndex === -1) {
        res.status(200).json({ code: -1, message: '导航名称不存在，更新失败' });
        return;
    }

    const updateNavData: any = {
        name: updateInfo.navName,
        url: updateInfo.navUrl,
    };

    if (updateInfo.navUrls && updateInfo.navUrls.length > 0) {
        updateNavData.urls = updateInfo.navUrls;
    }

    navData[index].categorys[categoryIndex].infos[navIndex] = updateNavData;

    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));

    res.status(200).json({ code: 0, message: '更新成功' });
}
