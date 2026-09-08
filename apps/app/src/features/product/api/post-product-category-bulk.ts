"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { CreateProductCategoryBulk } from "@/lib/contracts/product";
import { ProductCategory } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface PostProductCategoryBulkParams {
  data: CreateProductCategoryBulk;
  workspaceId: string;
}

export async function postProductCategoryBulk(
  params: PostProductCategoryBulkParams,
): Promise<ProductCategory[]> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/category/bulk`,
      {
        method: "POST",
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
          : errorData.message || "Gagal membuat banyak kategori",
      );
    }

    const result = (await response.json()) as ProductCategory[];
    return result;
  } catch (error) {
    console.error("Failed to post bulk product categories:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to post product categories in bulk");
  }
}
