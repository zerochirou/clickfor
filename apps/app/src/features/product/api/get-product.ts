'use server'

import { isAuthenticated } from "@/lib/auth/auth-check";
import { Product } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface GetProductsParams {
  workspaceId: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: PaginationMeta;
}

export async function getProducts(params: GetProductsParams): Promise<PaginatedProducts> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    
    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product`);
    if (params.page) url.searchParams.append("page", params.page.toString());
    if (params.limit) url.searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      url.toString(),
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
    const result = (await response.json()) as PaginatedProducts;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get products");
  }
}