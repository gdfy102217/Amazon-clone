import { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import prismadb from '@/libs/prismadb';
import { Prisma } from "@prisma/client";




// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
    api: {
      bodyParser: false,
    },
};

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export default async function handler(
    req: NextApiRequestWithSvixRequiredHeaders,
    res: NextApiResponse
) {
    const payload = (await buffer(req)).toString();
    const headers = req.headers;
    const wh = new Webhook(webhookSecret);
    let evt: Event | null = null;
    try {
        evt = wh.verify(payload, headers) as Event;
    } catch (_) {
        return res.status(400).json({});
    }
    // Handle the webhook
    const eventType: EventType = evt.type;
    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, ...attributes } = evt.data;
        const create: Prisma.UserCreateInput = {
            id: id as string,
            username: attributes.username as string,
            email: attributes.primary_email_address_id as string,
            createdAt: new Date(attributes.created_at as number),
            updatedAt: new Date(attributes.updated_at as number)
        }
        // const create: Prisma.UserCreateInput = { id: id as string, attributes };


        await prismadb.user.upsert({
            where: { id: id as string },
            update: create,
            create,
        })
        console.log({ id, attributes })
        // console.log("Email", attributes.)
    }
    res.json({});
}



type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
    headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};


// Generic (and naive) way for the Clerk event
// payload type.
type Event = {
    data: Record<string, string | number>;
    object: "event";
    type: EventType;
  };
  
type EventType = "user.created" | "user.updated" | "*";