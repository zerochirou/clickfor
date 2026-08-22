import {
  SignInBackground,
  SignInContent,
  SignInHeader,
} from "@/features/auth/components/signin";

export default function SignupPage() {
  return (
    <SignInBackground>
      <SignInHeader />
      <SignInContent />
    </SignInBackground>
  );
}
