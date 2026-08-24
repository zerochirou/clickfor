const DRAFT_KEY = "create-product-draft";

export function getDraft() {
  return localStorage.getItem(DRAFT_KEY);
}
