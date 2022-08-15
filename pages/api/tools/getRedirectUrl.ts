// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { request } from 'https';
import { URL } from 'url';

type Data = {
    url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const { url } = req.query;

    if (!url) {
        res.status(200).json({ url: '' });
        return;
    }

    const u = new URL(url as string);

    const options = {
        hostname: u.hostname,
        port: 443,
        path: u.pathname,
        method: 'GET',
    };

    const r = request(options, (r1) => {
        res.status(200).json({ url: r1.headers.location || '' });
    });

    r.end();
}
