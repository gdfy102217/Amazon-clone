import prismadb from '@/libs/prismadb';
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Find all products from product table
        const products = await prismadb.product.findMany();
        res.status(200).json(products);
    } else if (req.method === 'POST') {

        // Create a new product
        const { title, description, price } = req.body;
        const product = await prismadb.product.create({
            data: {
                title: title,
                description: description,
                price: price,
            },
        });
        res.status(200).json(product);
    }
}