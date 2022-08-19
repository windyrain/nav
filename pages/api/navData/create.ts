// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getJsonData, updateNavData } from './query';
import { DATA_TYPE } from './type';

type ReqBody = {
    type?: string;
    departmentName?: string;
    categoryName?: string;
    navName?: string;
    navUrl?: string;
    navUrls?: Array<{ env: string; url: string }>;
};

type ResData = {
    code: number;
    message: string;
    data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
    const { type, departmentName, categoryName, navName, navUrl, navUrls } = req.body as ReqBody;

    if (typeof type === 'undefined') {
        res.status(200).json({ code: -1, message: '创建类型有误' });
        return;
    }

    if (Number(type) === DATA_TYPE.Department) {
        return createDepartment(req, res, departmentName);
    }

    if (Number(type) === DATA_TYPE.Category) {
        return createCategory(req, res, { departmentName, categoryName });
    }

    if (Number(type) === DATA_TYPE.Nav) {
        return createNav(req, res, { departmentName, categoryName, navName, navUrl, navUrls });
    }
}

function createDepartment(req: NextApiRequest, res: NextApiResponse<ResData>, departmentName: string = '') {
    const navData = getJsonData();
    const departments = navData.map((item) => item.name);

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，创建失败' });
        return;
    }

    if (departments.includes(departmentName)) {
        res.status(200).json({ code: -1, message: '部门名称已存在，创建失败' });
        return;
    }

    departments.push(departmentName);

    navData.push({ name: departmentName, categorys: [] });

    updateNavData(navData);

    res.status(200).json({ code: 0, message: '创建成功' });
}

function createCategory(
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
        res.status(200).json({ code: -1, message: '部门名称为空，创建失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，创建失败' });
        return;
    }

    const index = navData.findIndex(({ name }) => name === departmentName);

    if (index === -1) {
        res.status(200).json({ code: -1, message: '部门名称不存在，创建失败' });
        return;
    }

    const { categorys } = navData[index];
    const categoryNames = categorys.map(({ name }) => name);

    if (categoryNames.includes(categoryName)) {
        res.status(200).json({ code: -1, message: '分类名称已存在，创建失败' });
        return;
    }

    navData[index].categorys.push({ name: categoryName, infos: [] });

    updateNavData(navData);

    res.status(200).json({ code: 0, message: '创建成功' });
}

function createNav(
    req: NextApiRequest,
    res: NextApiResponse<ResData>,
    data: {
        departmentName?: string;
        categoryName?: string;
        navName?: string;
        navUrl?: string;
        navUrls?: Array<{ env: string; url: string }>;
    },
) {
    const navData = getJsonData();
    const { departmentName = '', categoryName = '', navName, navUrl, navUrls = [] } = data;

    if (!departmentName) {
        res.status(200).json({ code: -1, message: '部门名称为空，创建失败' });
        return;
    }

    if (!categoryName) {
        res.status(200).json({ code: -1, message: '分类名称为空，创建失败' });
        return;
    }

    if (!navName) {
        res.status(200).json({ code: -1, message: '导航名称为空，创建失败' });
        return;
    }

    if (!navUrl) {
        res.status(200).json({ code: -1, message: '导航链接为空，创建失败' });
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

    const createNavData: any = {
        name: navName,
        url: navUrl,
    };

    if (navUrls && navUrls.length > 0) {
        createNavData.urls = navUrls;
    }

    navData[index].categorys[categoryIndex].infos.push(createNavData);

    updateNavData(navData);

    res.status(200).json({ code: 0, message: '创建成功' });
}
