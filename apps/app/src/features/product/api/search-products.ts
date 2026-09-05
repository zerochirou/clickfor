'use server'

import { isAuthenticated } from "@/lib/auth/auth-check";
import { Product } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface SearchProductsParams {
  workspaceId: string;
  query: string;
}

export async function searchProducts(params: SearchProductsParams): Promise<Product[]> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const encodedQuery = encodeURIComponent(params.query.trim());
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/search?query=${encodedQuery}`,
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
    const result = (await response.json()) as Product[];
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to search products");
  }
}
