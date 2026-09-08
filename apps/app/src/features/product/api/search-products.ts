"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

import { PaginatedProducts } from "./get-product";

interface SearchProductsParams {
  workspaceId: string;
  query: string;
  page?: number;
  limit?: number;
}

export async function searchProducts(
  params: SearchProductsParams,
): Promise<PaginatedProducts> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");

    const url = new URL(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/search`,
    );
    url.searchParams.append("query", params.query.trim());
    if (params.page) url.searchParams.append("page", params.page.toString());
    if (params.limit) url.searchParams.append("limit", params.limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
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
    const result = (await response.json()) as PaginatedProducts;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to search products");
  }
}
