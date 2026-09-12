"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function deleteWorkspace(workspaceId: string) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const serverApi =
      process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000/api";
    const response = await fetch(`${serverApi}/workspace/${workspaceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(
        Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message,
      );
    }

    return { success: true };
  } catch (error) {
    if (
      isRedirectError(error) ||
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("Failed to delete workspace:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete workspace");
  }
}
