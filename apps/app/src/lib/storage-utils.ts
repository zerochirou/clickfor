/**
 * Resolves an image path, storage key, or URL into a fully-qualified displayable image URL.
 *
 * Handles:
 * - null / undefined / empty string -> returns null
 * - absolute URLs (http://, https://, blob:, data:, /) -> returns as is (e.g. OAuth provider avatars, local blob previews)
 * - relative storage keys (e.g. "avatars/...", "workspaces/...", "images/...") -> prepends appropriate storage/bucket URL
 */
export function getStorageImageUrl(
  imagePath: string | null | undefined,
  type?: "avatar" | "workspace" | "product",
): string | null {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  const trimmed = imagePath.trim();
  if (!trimmed) {
    return null;
  }

  // Already an absolute URL, data URL, blob preview, or local public asset path
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  const s3Endpoint = (
    process.env.NEXT_PUBLIC_S3_ENDPOINT ||
    process.env.NEXT_PUBLIC_S3_URL ||
    "http://localhost:9000"
  ).replace(/\/$/, "");

  if (type === "product" || trimmed.startsWith("images/")) {
    const productBucketUrl = process.env.NEXT_PUBLIC_S3_PRODUCT_BUCKET;
    if (productBucketUrl) {
      return `${productBucketUrl.replace(/\/$/, "")}/${trimmed}`;
    }
    return `${s3Endpoint}/products/${trimmed}`;
  }

  if (type === "workspace" || trimmed.startsWith("workspaces/")) {
    const workspaceBucketUrl = process.env.NEXT_PUBLIC_S3_WORKSPACE_BUCKET;
    if (workspaceBucketUrl) {
      return `${workspaceBucketUrl.replace(/\/$/, "")}/${trimmed}`;
    }
    return `${s3Endpoint}/workspaces/${trimmed}`;
  }

  if (type === "avatar" || trimmed.startsWith("avatars/")) {
    const avatarBucketUrl = process.env.NEXT_PUBLIC_S3_AVATAR_BUCKET;
    if (avatarBucketUrl) {
      return `${avatarBucketUrl.replace(/\/$/, "")}/${trimmed}`;
    }
    return `${s3Endpoint}/avatars/${trimmed}`;
  }

  return `${s3Endpoint}/${trimmed}`;
}
