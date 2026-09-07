const getDraftKey = (workspaceId?: string) =>
  workspaceId ? `create-product-draft:${workspaceId}` : "create-product-draft";

export function deleteDraft(workspaceId?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getDraftKey(workspaceId));
  } catch (error) {
    console.error("Gagal menghapus draft dari localStorage:", error);
  }
}
