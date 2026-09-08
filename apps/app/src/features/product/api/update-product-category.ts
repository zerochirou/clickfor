"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { ProductCategory } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface UpdateProductCategoryParams {
  workspaceId: string;
  categoryId: string;
  data: {
    name?: string;
    description?: string;
    icon?: string;
  };
}

export async function updateProductCategory(
  params: UpdateProductCategoryParams,
) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/category/${params.categoryId}`,
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

    const result = (await response.json()) as ProductCategory;
    return result;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update product category");
  }
}
