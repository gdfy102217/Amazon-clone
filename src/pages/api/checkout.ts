import { NextApiRequest, NextApiResponse } from "next";
import { StoreProduct } from "../../../type";
import Stripe from "stripe";
import { stripe } from "@/libs/stripe";
import { useAuth, useUser } from "@clerk/clerk-react";
import { SignedIn, UserButton, useSession } from "@clerk/clerk-react";
import { decreaseQuantity } from "@/store/nextSlice";


// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const { items, email, userId } = req.body;
  // const { session } = useSession();
  // const { user } = useUser();
  // if (!session) {
  //   return res.status(401).json({
  //     error: "you need to be authenticated",
  //   });
  // }


  const modifiedItems = items.map((item: StoreProduct) => ({
    quantity: item.quantity,
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        description: item.description,
        images: [item.image],
      },
    },
  }));

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = modifiedItems;
  console.log("email", email);
  console.log("items", items);
  console.log("line_items", line_items);

  
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId: userId,
        email: email,
        images: JSON.stringify(items.map((item: any) => item.image)),
        product_ids: JSON.stringify(items.map((item: any) => item._id)),
        prices: JSON.stringify(items.map((item: any) => item.price)),
        quantity: JSON.stringify(items.map((item: any) => item.quantity)),
      },
    });
    res.status(200).json({
      id: session.id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "an error occured, unable to create session",
    });
  }





  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   shipping_address_collection: {
  //     allowed_countries: ["BD", "US", "OM", "CA", "GB"],
  //   },
  //   line_items: modifiedItems,
  //   mode: "payment",
  //   success_url: `${process.env.NEXTAUTH_URL}/success`,
  //   cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
  //   metadata: {
  //     email,
  //     images: JSON.stringify(items.map((item: any) => item.image)),
  //   },
  // });
  // res.status(200).json({
  //   id: session.id,
  // });

}
