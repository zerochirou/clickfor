"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { Product } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  purchasePrice?: number;
  salePrice?: number;
  stock?: number;
  minStock?: number;
  unit?: string;
  isActive?: boolean;
  isUp?: boolean;
  image?: string | null;
}

export interface UpdateProductParams {
  workspaceId: string;
  productId: string;
  data: UpdateProductPayload;
}

export async function updateProduct(
  params: UpdateProductParams,
): Promise<Product> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/${params.productId}`,
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
    const result = (await response.json()) as Product;
    return result;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update product",
    );
  }
}

interface UpdateProductOptimizationParams {
  workspaceId: string;
  productId: string;
  data: { isOptimized: boolean };
}

export async function updateProductOptimization(
  params: UpdateProductOptimizationParams,
) {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/${params.productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify({ isUp: params.data.isOptimized }),
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
    const result = (await response.json()) as Product;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update product");
  }
}

// Backward compatibility alias for the typo version
export const updateProductOptimazOptimization = updateProductOptimization;
