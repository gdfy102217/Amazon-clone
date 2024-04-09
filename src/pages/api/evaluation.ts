import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";
import { EventMetaData } from '@/pages/hooks/useEventTracker';



interface EventData {
    event: string;
    content: string;
    metadata: EventMetaData;
}
  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);
    console.log('Transfer endpoint: ' + process.env.NEXT_PUBLIC_EVAL_ENDPOINT);
    const { app, type, elementId, msg, agentId, taskId, urlPath, timestamp, payload } = req.body;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + agentId,
    }

    const metadata: EventMetaData = {
        app: app,
        type: type,
        elementId: elementId,
        msg: msg,
        agentId: agentId,
        taskId: taskId,
        urlPath: urlPath,
        timestamp: timestamp,
        payload
    }
    const eventData: EventData = {
        event: app + '.' + type,
        content: msg,
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