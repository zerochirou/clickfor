"use server";

import { ProductCategory } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

export async function getProductCategory(workspaceId: string) {
  try {
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${workspaceId}/product/category`,
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
    const result = (await response.json()) as ProductCategory[];
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get product category");
  }
}
