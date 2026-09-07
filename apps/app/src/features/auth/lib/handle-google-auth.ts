import { authClient } from "@/lib/auth/auth-client";

export async function handleGoogleAuth() {
  const test = await authClient.signIn.social({
    provider: "google",
    callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/workspace`,
  });
  console.log(test);
}
