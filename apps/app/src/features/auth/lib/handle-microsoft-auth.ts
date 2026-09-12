import { authClient } from "@/lib/auth/auth-client";

export async function handleMicrosoftAuth() {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001");

  await authClient.signIn.social({
    provider: "microsoft",
    callbackURL: `${origin}/workspace`,
  });
}
