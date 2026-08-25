"use server";

import { CreateProductCategory } from "@/lib/contracts/product";
import { ProductCategory } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

export async function postProductCategory(
  data: CreateProductCategory,
  workspaceId: string,
) {
  try {
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${workspaceId}/product/category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify(data),
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
    throw new Error("Failed to post workspaces");
  }
}
