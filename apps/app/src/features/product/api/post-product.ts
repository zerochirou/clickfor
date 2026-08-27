"use server";

import { CreateProduct } from "@/lib/contracts/product";
import { Product } from "@/lib/types/product";
import { ErrorResponse } from "@/lib/types/response";
import { headers } from "next/headers";

interface PostProductParams {
  data: CreateProduct;
  workspaceId: string;
  categoryId: string;
}

export async function postProduct(params: PostProductParams) {
  try {
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/workspace/${params.workspaceId}/product/category/${params.categoryId}`,
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
    const result = (await response.json()) as Product;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to post workspaces");
  }
}
