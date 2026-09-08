"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { CreateProductCategory } from "@/lib/contracts/product";
import { ProductCategory } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface PostProductCategoryParams {
  data: CreateProductCategory;
  workspaceId: string;
}

export async function postProductCategory(params: PostProductCategoryParams) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/category`,
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
          : errorData.message,
      );
    }
    const result = (await response.json()) as ProductCategory;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to post product category");
  }
}
