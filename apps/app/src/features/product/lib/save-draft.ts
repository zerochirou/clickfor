"use client";

import { CreateProductInput } from "./product-schema";

const getDraftKey = (workspaceId?: string) =>
  workspaceId ? `create-product-draft:${workspaceId}` : "create-product-draft";

export function saveDraft(payload: CreateProductInput, workspaceId?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getDraftKey(workspaceId), JSON.stringify(payload));
  } catch (error) {
    console.error("Gagal menyimpan draft ke localStorage:", error);
  }
}
