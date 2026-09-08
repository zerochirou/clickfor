import { Suspense } from "react";
import FlickerSpinner from "@/components/commons/flicker-loading/flicker-spinner";
import { CreateCategoryBulkForm } from "@/features/product/components/form/create-category-bulk-form";

async function AddManyContent({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return <CreateCategoryBulkForm workspaceId={workspaceId} />;
}

export default function AddManyProductCategoryPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center min-h-75">
          <FlickerSpinner />
        </div>
      }
    >
      <AddManyContent params={params} />
    </Suspense>
  );
}
