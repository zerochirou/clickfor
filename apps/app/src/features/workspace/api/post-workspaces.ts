"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { CreateWorkspace } from "@/lib/contracts/workspace";
import { ErrorResponse } from "@/lib/types/response";
import { Workspace } from "@/lib/types/workspace";
import { headers } from "next/headers";

interface PostWorkspaceParams {
  data: CreateWorkspace;
}

export async function createWorkspace(params: PostWorkspaceParams) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        method: "POST",
        body: JSON.stringify(params.data),
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
    const result = (await response.json()) as Workspace;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to post workspaces");
  }
}
