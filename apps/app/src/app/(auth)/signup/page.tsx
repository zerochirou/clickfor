import { SignUpPageContent } from "@/features/auth/components/signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account - Clickfor",
  description:
    "Create your Clickfor account to elevate every design and digital store you make.",
};

export default function SignUpPage() {
  return <SignUpPageContent />;
}
