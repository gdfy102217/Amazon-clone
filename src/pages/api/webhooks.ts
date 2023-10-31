import { stripe } from "@/libs/stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import getRawBody from 'raw-body';
import { useDispatch } from "react-redux";
import { deleteProduct } from "@/store/nextSlice";
import prismadb from "@/libs/prismadb";



export const config = {
    api: {
      bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const buffer = await getRawBody(req);
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            buffer,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log("Event successfully constructed.")
    } catch (error: any) {
        console.log("Error constructing event.")
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const email = session?.metadata?.email;


    let images, product_ids, quantity, prices;
    if (session?.metadata?.images) {
        images = JSON.parse(session.metadata.images);
    }

    if (session?.metadata?.product_ids) {
        product_ids = JSON.parse(session.metadata.product_ids);
    }

    if (session?.metadata?.quantity) {
        quantity = JSON.parse(session.metadata.quantity);
    }

    if (session?.metadata?.prices) {
        prices = JSON.parse(session.metadata.prices);
    }

    console.log("userId", userId);
    console.log("email", email);
    console.log("images", images);
    console.log("product_ids", product_ids);
    console.log("quantity", quantity);
    console.log("prices", prices);

    if (product_ids && quantity && userId) {
        // total value of the order = prices * quantity
        let total = 0;
        for (let i = 0; i < prices.length; i++) {
            total += prices[i] * quantity[i];
        }
        const order = await prismadb.order.create({
            data: {
                userId: userId,
                total: total,
            }
        });
        for (let i = 0; i < product_ids.length; i++) {
            const orderItem = await prismadb.orderItem.create({
                data: {
                    productId: product_ids[i],
                    quantity: quantity[i],
                    price: prices[i],
                    orderId: order.id, // Use the order ID from the created order
                },
            });
            console.log("Order item created: ", orderItem);
        }
    }

    

    

    if (event.type === "checkout.session.completed") {
        if (!email || !images || !product_ids) { 
            return res.status(400).json({ error: "Webhook Error: Missing metadata" });
        }
        console.log("Payment was successful");
        return res.status(200).json({ received: true });
    } else {
        console.log("Unhandled event type");
        return res.status(200).json({ received: false });
    }

    res.status(200).json({ received: false });
}