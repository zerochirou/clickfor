import { Button } from "@/components/ui/button";
import { getProducts } from "@/features/product/api/get-product";
import { ProductTable } from "@/features/product/components/table/product-table";
import { ProductsProvider } from "@/features/product/lib/products-provider";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const products = await getProducts({ workspaceId: workspaceId });
  return (
    <ProductsProvider initialProducts={products}>
      <div className="p-8">
        <header className="flex items-center justify-between pb-4">
          <div></div>
          <Link href={`/workspace/${workspaceId}/product/add`} prefetch>
            <Button>
              Tambah Produk <Plus />
            </Button>
          </Link>
        </header>
        <Suspense>
          <ProductTable products={products} />
        </Suspense>
      </div>
    </ProductsProvider>
  );
}
