const DRAFT_KEY = "create-product-draft";

export function deleteDraft() {
  localStorage.removeItem(DRAFT_KEY);
}