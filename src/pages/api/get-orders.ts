import prismadb from '@/libs/prismadb';
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Get user orders history
    if (req.method === 'GET') {
        const userId = req.query.userId as string;
        if (!userId) {
            res.status(400).json({ error: 'Missing user id' });
        }
        const orders = await prismadb.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        res.status(200).json(orders);
    }
}