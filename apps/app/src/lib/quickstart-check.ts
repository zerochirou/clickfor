"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Workspace } from "./types/workspace";

const QUICKSTART_COOKIE_NAME = "quickstart_completed";

export async function checkIsQuickStart(workspaces: Workspace[]) {
  const cookiesStore = await cookies();
  const quickstartCookie = cookiesStore.get(QUICKSTART_COOKIE_NAME);
  const hasCompletedQuickstart = quickstartCookie?.value === "true";
  if (workspaces.length === 0 || !hasCompletedQuickstart) {
    redirect("/quickstart");
  }
}

export async function setQuickstartCompleted() {
  const cookiesStore = await cookies();

  cookiesStore.set(QUICKSTART_COOKIE_NAME, "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
