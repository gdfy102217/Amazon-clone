import prismadb from '@/libs/prismadb';
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Get user orders history
    if (req.method === 'GET') {
        const productId = req.query.productId as string;
        if (!productId) {
            res.status(400).json({ error: 'Missing user id' });
        }
        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
        });
        res.status(200).json(product);
    }
}