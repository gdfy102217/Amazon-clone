import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <SignUp afterSignUpUrl='/index' signInUrl='/sign-in'/>
        </div>
    );
}