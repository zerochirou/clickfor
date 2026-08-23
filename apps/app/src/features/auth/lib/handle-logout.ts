'use client'

import { authClient } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";

export async function handleLogout() {
  await authClient.signOut();
  redirect("/signin")
}