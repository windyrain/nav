import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

type NavData = Record<
    string,
    Array<{ name: string; infos: Array<{ name: string; url: string; urls?: Array<{ env: string; url: string }> }> }>
>;

type NavJSONData = Array<{
    name: string;
    categorys: Array<{
        name: string;
        infos: Array<{
            name: string;
            url: string;
            urls?: Array<{ env: string; url: string }>;
        }>;
    }>;
}>;

let jsonData: NavJSONData = JSON.parse(fs.readFileSync('data/data.json', 'utf-8'));
const navData: NavData = {};

jsonData.map(({ name, categorys }) => {
    navData[name] = categorys;
});

export function updateNavData(data: NavJSONData) {
    jsonData = data;
    data.map(({ name, categorys }) => {
        navData[name] = categorys;
    });
    fs.writeFileSync('data/data.json', JSON.stringify(navData, null, 4));
}

export function getJsonData() {
    return jsonData;
}

export function getNavData() {
    return navData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ code: 0, message: '查询成功', data: navData });
}
