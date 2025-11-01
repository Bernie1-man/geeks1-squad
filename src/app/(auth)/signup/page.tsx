import dynamic from "next/dynamic";

const SignupForm = dynamic(() => import("@/components/auth/signup-form").then(mod => mod.SignupForm));

export default function SignupPage() {
  return <SignupForm />;
}
