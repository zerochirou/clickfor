"use server";

import { headers } from "next/headers";
import { authClient } from "./auth-client";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  if (!session) {
    redirect("/signin");
  }

  return session;
}
