const getDraftKey = (workspaceId?: string) =>
  workspaceId ? `create-product-draft:${workspaceId}` : "create-product-draft";

export function getDraft(workspaceId?: string) {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(getDraftKey(workspaceId));
  } catch {
    return null;
  }
}
