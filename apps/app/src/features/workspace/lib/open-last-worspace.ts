"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LAST_WORKSPACE_COOKIE_NAME = "last_workspace";

export async function openLastWorkspace() {
  const cookiesStore = await cookies();
  const lastWorkspace = cookiesStore.get(LAST_WORKSPACE_COOKIE_NAME);
  if (!lastWorkspace) return;
  redirect(`/workspace/${lastWorkspace.value}`);
}

export async function saveLastWorkspace(workspaceId: string) {
  const cookiesStore = await cookies();
  cookiesStore.set(LAST_WORKSPACE_COOKIE_NAME, workspaceId);
}
