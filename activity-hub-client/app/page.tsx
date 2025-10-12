import Image from "next/image";
import { LoginForm } from "../components/auth/LoginForm";
import { AuthProvider } from '@/context/AuthContext'; 

export default function Home() {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </div>
  );
}
