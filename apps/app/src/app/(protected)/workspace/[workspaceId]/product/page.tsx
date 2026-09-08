import { Button } from "@/components/ui/button";
import { getProducts } from "@/features/product/api/get-product";
import { searchProducts } from "@/features/product/api/search-products";
import { ProductSearchBar } from "@/features/product/components/search/product-search-bar";
import { ProductTable } from "@/features/product/components/table/product-table";
import { ProductsProvider } from "@/features/product/lib/products-provider";
import FlickerSpinner from "@/components/commons/flicker-loading/flicker-spinner";
import { Package, PackagePlus, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function ProductContent({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams?: Promise<{ query?: string; page?: string; limit?: string }>;
}) {
  const { workspaceId } = await params;
  const resolvedSearchParams = await searchParams;
  const initialQuery = resolvedSearchParams?.query?.trim();
  const page = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const limit = resolvedSearchParams?.limit
    ? parseInt(resolvedSearchParams.limit)
    : 10;

  const result = initialQuery
    ? await searchProducts({ workspaceId, query: initialQuery, page, limit })
    : await getProducts({ workspaceId, page, limit });

  return (
    <ProductsProvider initialProducts={result.data} meta={result.meta}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <Link href={`/workspace/${workspaceId}/product/add`}>
          <Button variant={'secondary'}>
            <Package className="text-primary"/> Tambah Produk 
          </Button>
        </Link>
        <ProductSearchBar workspaceId={workspaceId} className="w-100" />
      </header>
      <ProductTable />
    </ProductsProvider>
  );
}

export default function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams?: Promise<{ query?: string; page?: string; limit?: string }>;
}) {
  return (
    <div className="p-4">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center min-h-75">
            <FlickerSpinner />
          </div>
        }
      >
        <ProductContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
