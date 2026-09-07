import { getProductById } from "@/features/product/api/get-product-by-id";
import { UpdateProductForm } from "@/features/product/components/form/update-product-form";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    workspaceId: string;
    productId: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { workspaceId, productId } = await params;

  let product;
  try {
    product = await getProductById({
      workspaceId,
      productId,
    });
  } catch (error) {
    console.error("Failed to load product for editing:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <UpdateProductForm product={product} workspaceId={workspaceId} />;
}
