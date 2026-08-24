"use client";

import { CreateProductInput } from "./product-schema";

  const DRAFT_KEY = "create-product-draft";

export function saveDraft(payload: CreateProductInput) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
}
