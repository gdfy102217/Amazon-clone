// hooks/useEventTracker.ts
import { useCallback } from 'react';
import axios from 'axios';

export interface EventMetaData {
  app: string;
  type: string;
  elementId: string;
  msg: string;
  agentId: string;
  taskId: string;
  urlPath: string;
  timestamp: number;
  payload?: {};
}



const useEventTracker = () => {

  const trackEvent = useCallback(async (eventData: EventMetaData) => {
    try {
      await axios.post(
                        '/api/evaluation',
                        eventData
                      );
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, []);

  return { trackEvent };
};

export default useEventTracker;