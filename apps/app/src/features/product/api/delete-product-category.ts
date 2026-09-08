"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface DeleteProductCategoryParams {
  workspaceId: string;
  categoryId: string;
}

export async function deleteProductCategory(
  params: DeleteProductCategoryParams,
) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/category/${params.categoryId}`,
      {
        method: "DELETE",
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

    return true;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete product category");
  }
}
