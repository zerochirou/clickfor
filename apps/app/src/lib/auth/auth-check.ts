import { cache } from "react";
import { headers } from "next/headers";
import { authClient } from "./auth-client";
import { redirect } from "next/navigation";

const getSessionInternal = cache(async () => {
  const requestHeaders = await headers();
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: requestHeaders,
    },
  });
  return session;
});

export async function isAuthenticated() {
  const session = await getSessionInternal();
  if (!session) {
    redirect("/signin");
  }

  return session;
}
