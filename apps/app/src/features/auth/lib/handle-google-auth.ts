import { authClient } from "@/lib/auth/auth-client";

export async function handleGoogleAuth() {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001");

  await authClient.signIn.social({
    provider: "google",
    callbackURL: `${origin}/workspace`,
  });
}

