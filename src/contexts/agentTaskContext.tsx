import { createContext, useContext } from 'react';
import { AgentTaskType } from '../../type';


export const AgentTaskContext = createContext<AgentTaskType>({
    agentId: '',
    taskId: '',
} as AgentTaskType);

export function useAgentTask() {
  return useContext(AgentTaskContext);
}