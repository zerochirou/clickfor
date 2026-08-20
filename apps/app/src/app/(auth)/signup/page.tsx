import {
  SignUpBackground,
  SignUpContent,
  SignUpFooter,
  SignUpHeader,
} from "@/features/auth/components/singup";

export default function SignupPage() {
  return (
    <SignUpBackground>
      <SignUpHeader />
      <SignUpContent />
      <SignUpFooter />
    </SignUpBackground>
  );
}
