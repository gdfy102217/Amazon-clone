import { SignIn } from "@clerk/clerk-react";
import { useAgentTask } from "@/contexts/agentTaskContext";
import useEventTracker, { EventMetaData }  from "@/pages/hooks/useEventTracker";


export default function SignInPage() {
    const { agentId, taskId } = useAgentTask();
    const { trackEvent } = useEventTracker();

    trackEvent({
        app: 'amazon',
        type: `task_${taskId}`,
        elementId: `visit_sign_in`,
        msg: `visit sign-in page`,
        agentId: agentId,
        taskId: taskId,
        urlPath: window.location.pathname,
        timestamp: Date.now(),
      } as  EventMetaData);
    
    return (
        <div className="flex items-center justify-center h-full">
            <SignIn afterSignInUrl={`/?agentId=${agentId}&taskId=${taskId}`} signUpUrl={`/sign-up?agentId=${agentId}&taskId=${taskId}`}/>
        </div>
    );
}