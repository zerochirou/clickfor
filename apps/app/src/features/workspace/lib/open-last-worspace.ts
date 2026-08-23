"use server";

import { cookies } from "next/headers";

const LAST_WORKSPACE_COOKIE_NAME = "last_workspace";

export async function saveLastWorkspace(workspaceId: string) {
  const cookiesStore = await cookies();
  cookiesStore.set(LAST_WORKSPACE_COOKIE_NAME, workspaceId);
}

export async function deleteLastWorkspace() {
  const cookiesStore = await cookies();
  cookiesStore.delete(LAST_WORKSPACE_COOKIE_NAME);
}