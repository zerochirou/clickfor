import { authClient } from "@/lib/auth/auth-client";

export async function handleGithubAuth() {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001");

  await authClient.signIn.social({
    provider: "github",
    callbackURL: `${origin}/workspace`,
  });
}
