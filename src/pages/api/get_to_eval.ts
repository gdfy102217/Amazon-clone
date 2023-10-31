import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AGENT_AUTH_SECRET,
}
interface EventMetaData {
    app: string;
    type: string;
    elementId: string;
    event_msg: string;
    agent_id: string;
    timestamp: number;
  }

interface EventData {
    event: string;
    content: string;
    metadata: EventMetaData;
}
  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);
    console.log('Transfer endpoint: ' + process.env.NEXT_PUBLIC_EVAL_ENDPOINT);
    const { app, type, elementId, event_msg, agent_id, timestamp } = req.body;
    const metadata: EventMetaData = {
        app: app,
        type: type,
        elementId: elementId,
        event_msg: event_msg,
        agent_id: agent_id,
        timestamp: timestamp
    }
    const eventData: EventData = {
        event: app + '.' + type,
        content: event_msg,
        metadata: metadata
    }
    try{
        
        const response = await axios.post(
            process.env.NEXT_PUBLIC_EVAL_ENDPOINT as string,
            eventData,
            {headers}
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}