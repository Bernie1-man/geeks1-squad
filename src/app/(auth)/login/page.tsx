import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/auth/login-form").then(mod => mod.LoginForm));

export default function LoginPage() {
  return <LoginForm />;
}
