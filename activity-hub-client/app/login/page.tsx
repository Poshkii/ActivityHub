'use client';

import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
    return (
        <>
            <div style={{height: "80vh"}} className="flex items-center justify-center p-4">
                <LoginForm />
            </div>
        </>
        
    );
}
