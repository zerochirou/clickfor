"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { ErrorResponse } from "@/lib/types/response";
import { Workspace } from "@/lib/types/workspace";
import { headers } from "next/headers";

export async function getWorkspaces() {
  try {
    await isAuthenticated();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace`,
      {
        credentials: "include",
        headers: await headers(),
      },
    );
    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(
        Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message,
      );
    }
    const workspaces = (await response.json()) as Workspace[];
    return workspaces;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get workspaces");
  }
}

export async function getWorkspaceById(workspaceId: string) {
  try {
    await isAuthenticated();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${workspaceId}`,
      {
        credentials: "include",
        headers: await headers(),
      },
    );
    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(
        Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message,
      );
    }
    const workspace = (await response.json()) as Workspace;
    return workspace;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get workspace by id");
  }
}
