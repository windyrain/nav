import fs from 'fs';
import NextCors from 'nextjs-cors';
import type { NextApiRequest, NextApiResponse } from 'next';

type UserJSONData = Array<{
    username: string;
    password: string;
}>;

let jsonData: UserJSONData = JSON.parse(fs.readFileSync('data/user.json', 'utf-8'));

export function getJsonData() {
    return jsonData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        // Options
        methods: ['GET'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    res.status(200).json({
        code: 0,
        message: '查询成功',
        data: jsonData.map(({ username }) => ({ username })),
    });
}
