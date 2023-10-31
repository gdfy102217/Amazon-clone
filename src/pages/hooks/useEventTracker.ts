// hooks/useEventTracker.ts
import { useCallback } from 'react';
import axios from 'axios';

interface EventMetaData {
  app: string;
  type: string;
  elementId: string;
  event_msg: string;
  agent_id: string;
  timestamp: number;
}


const useEventTracker = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AGENT_AUTH_SECRET,
  }

  const trackEvent = useCallback(async (eventData: EventMetaData) => {
    try {
      console.log(process.env)
      if (!process.env.NEXT_PUBLIC_EVAL_ENDPOINT) {
        console.error('NEXT_PUBLIC_EVAL_ENDPOINT is not defined');
        return;
      }
      await axios.post(
                        // process.env.NEXT_PUBLIC_EVAL_ENDPOINT as string,
                        '/api/get_to_eval',
                        eventData
                        // { headers }
                      );
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, []);

  return { trackEvent };
};

export default useEventTracker;