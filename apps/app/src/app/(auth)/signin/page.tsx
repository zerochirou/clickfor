import { SignInPageContent } from "@/features/auth/components/signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Clickfor",
  description: "Sign in to access your workspace and digital store.",
};

export default function SignInPage() {
  return <SignInPageContent />;
}
