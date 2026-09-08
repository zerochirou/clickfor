import { Suspense } from "react";
import FlickerSpinner from "@/components/commons/flicker-loading/flicker-spinner";
import { getProductCategory } from "@/features/product/api/get-product-category";
import { CategoryTable } from "@/features/product/components/table/category-table";

async function CategoryContent({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const categories = await getProductCategory({ workspaceId });

  return (
    <CategoryTable
      initialCategories={categories || []}
      workspaceId={workspaceId}
    />
  );
}

export default function ProductCategoryPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center min-h-75">
            <FlickerSpinner />
          </div>
        }
      >
        <CategoryContent params={params} />
      </Suspense>
    </div>
  );
}
