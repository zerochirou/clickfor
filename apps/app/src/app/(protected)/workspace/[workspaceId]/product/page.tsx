import { Button } from "@/components/ui/button";
import { getProducts } from "@/features/product/api/get-product";
import { searchProducts } from "@/features/product/api/search-products";
import { ProductSearchBar } from "@/features/product/components/search/product-search-bar";
import { ProductTable } from "@/features/product/components/table/product-table";
import { ProductsProvider } from "@/features/product/lib/products-provider";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams?: Promise<{ query?: string }>;
}) {
  const { workspaceId } = await params;
  const resolvedSearchParams = await searchParams;
  const initialQuery = resolvedSearchParams?.query?.trim();

  const products = initialQuery
    ? await searchProducts({ workspaceId, query: initialQuery })
    : await getProducts({ workspaceId });

  return (
    <ProductsProvider initialProducts={products}>
      <div className="p-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <ProductSearchBar workspaceId={workspaceId} />
          <Link href={`/workspace/${workspaceId}/product/add`} prefetch>
            <Button>
              Tambah Produk <Plus />
            </Button>
          </Link>
        </header>
        <Suspense>
          <ProductTable />
        </Suspense>
      </div>
    </ProductsProvider>
  );
}
