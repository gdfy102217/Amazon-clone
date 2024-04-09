import { SignUp } from "@clerk/clerk-react";
import { useAgentTask } from "@/contexts/agentTaskContext";

export default function SignUpPage() {
    const { agentId, taskId } = useAgentTask();
    return (
        <div className="flex items-center justify-center h-full">
            <SignUp afterSignUpUrl={`/?agentId=${agentId}&taskId=${taskId}`} signInUrl={`/sign-in?agentId=${agentId}&taskId=${taskId}`}/>
        </div>
    );
}