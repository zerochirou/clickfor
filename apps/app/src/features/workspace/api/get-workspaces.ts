import { cache } from "react";
import { isAuthenticated } from "@/lib/auth/auth-check";
import { ErrorResponse } from "@/lib/types/response";
import { Workspace } from "@/lib/types/workspace";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function getWorkspaces() {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace`,
      {
        headers: {
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
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
    if (
      isRedirectError(error) ||
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error(error);
    throw new Error("Failed to get workspaces");
  }
}

const fetchWorkspaceByIdInternal = cache(
  async (workspaceId: string, cookieHeader: string | null) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${workspaceId}`,
      {
        headers: {
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
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
  },
);

export async function getWorkspaceById(workspaceId: string) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    return await fetchWorkspaceByIdInternal(workspaceId, cookieHeader);
  } catch (error) {
    if (
      isRedirectError(error) ||
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error(error);
    throw new Error("Failed to get workspace by id");
  }
}
