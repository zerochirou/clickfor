"use server";

import { PresignedUploadURL } from "@/lib/types/presigned-upload-url";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

export async function getPresignedUploadURL(workspaceId: string, fileName: string, contentType: string) {
  try {
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${workspaceId}/product/presigned-url?fileName=${fileName}&contentType=${contentType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
    const result = (await response.json()) as PresignedUploadURL;
    if (!result.success) {
      throw new Error(
        `Failed to get presigned upload URL: ${result.uploadURL}`,
      );
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get presigned upload URL");
  }
}
