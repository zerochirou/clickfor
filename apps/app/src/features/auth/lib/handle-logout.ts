"use client";

import { authClient } from "@/lib/auth/auth-client";

export async function handleLogout(router?: { push: (url: string) => void }) {
  await authClient.signOut();
  if (router) {
    router.push("/signin");
  } else if (typeof window !== "undefined") {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/signin";
  }
}
