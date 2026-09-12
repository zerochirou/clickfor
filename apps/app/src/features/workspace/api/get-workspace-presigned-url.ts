"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { PresignedUploadURL } from "@/lib/types/presigned-upload-url";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface GetWorkspacePresignedUploadURLParams {
  workspaceId: string;
  fileName: string;
  contentType?: string;
}

export async function getWorkspacePresignedUploadURL(
  params: GetWorkspacePresignedUploadURLParams,
) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const authHeader = requestHeaders.get("authorization");

    const searchParams = new URLSearchParams();
    searchParams.set("fileName", params.fileName);
    if (params.contentType) {
      searchParams.set("contentType", params.contentType);
    }

    const serverApi =
      process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000/api";
    const response = await fetch(
      `${serverApi.replace(/\/$/, "")}/workspace/${params.workspaceId}/logo/presigned-url?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...(authHeader ? { Authorization: authHeader } : {}),
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
    const result = (await response.json()) as PresignedUploadURL;
    if (!result.success) {
      throw new Error(
        `Failed to get presigned upload URL for workspace logo: ${result.uploadURL}`,
      );
    }
    return result;
  } catch (error) {
    if (
      isRedirectError(error) ||
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error(error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get workspace logo presigned upload URL",
    );
  }
}
