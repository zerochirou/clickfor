"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { ErrorResponse } from "@/lib/types/response";
import { Workspace } from "@/lib/types/workspace";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export interface UpdateWorkspaceData {
  workspaceName?: string;
  description?: string | null;
  isActive?: boolean;
  image?: string | null;
  brandColor?: string | null;
  transparentSidebar?: boolean | null;
  sidebarFeature?: string | null;
  tablesView?: string | null;
}

interface UpdateWorkspaceParams {
  workspaceId: string;
  data: UpdateWorkspaceData;
}

export async function updateWorkspace(
  params: UpdateWorkspaceParams,
): Promise<Workspace> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const serverApi =
      process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000/api";
    const response = await fetch(
      `${serverApi}/workspace/${params.workspaceId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
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

    return (await response.json()) as Workspace;
  } catch (error) {
    if (
      isRedirectError(error) ||
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("Failed to update workspace:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update workspace");
  }
}
