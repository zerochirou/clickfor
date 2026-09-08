"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "../../lib/products-provider";
import { Product } from "@/lib/types/product";
import {
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  SquareArrowOutUpRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import Image from "next/image";
import { useWorkspace } from "@/features/workspace/lib/workspace-provider";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CategoryTooltip } from "../table/category-tooltip";
import { Separator } from "@/components/ui/separator";

interface ProductCardListProps {
  products?: Product[];
}

export function ProductCardList({
  products: propProducts,
}: ProductCardListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { workspace } = useWorkspace();
  const {
    products: contextProducts,
    meta,
    searchQuery,
    isSearching,
    resetSearch,
    updatedProductId,
  } = useProducts();

  const products = propProducts ?? contextProducts;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {isSearching && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground border rounded-lg bg-card">
          <Spinner className="w-5 h-5 text-primary" />
          <span className="text-sm">Mencari produk...</span>
        </div>
      ) : products.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {products.map((item) => {
              const isJustUpdated = updatedProductId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/workspace/${workspace.id}/product/${item.id}`}
                    className="block h-full"
                  >
                    <Card
                      className={cn(
                        "h-full overflow-hidden pt-0 transition-all duration-300 group flex flex-col",
                        isJustUpdated
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50",
                      )}
                    >
                      <div className="relative w-full aspect-video bg-muted overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_S3_PRODUCT_BUCKET}/${item.image}`}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute top-2 right-2">
                          <AnimatePresence mode="wait">
                            {item.isUp ? (
                              <motion.div
                                key="optimized"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="inline-flex"
                              >
                                <Badge
                                  variant="default"
                                  className="shadow-sm bg-primary/90 hover:bg-primary backdrop-blur-sm gap-1"
                                >
                                  <Zap className="size-3 fill-current" />
                                  <span className="text-[10px]">Optimized</span>
                                </Badge>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle
                            className="text-lg line-clamp-1 group-hover:text-primary transition-colors"
                            title={item.name}
                          >
                            {item.name}
                          </CardTitle>
                          <div
                            onClick={(e) => e.preventDefault()}
                            className="shrink-0"
                          >
                            <CategoryTooltip
                              name={item.category.name}
                              description={item.category.description}
                              icon={item.category.icon}
                            />
                          </div>
                        </div>
                        <CardDescription className="font-mono text-xs truncate">
                          {item.sku}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 flex-grow">
                        <div className="flex flex-col gap-2">
                          <div className="flex font-mono justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Harga Jual
                            </span>
                            <span className="font-semibold text-foreground">
                              Rp{" "}
                              {Number(item.salePrice).toLocaleString("id-ID")} /{" "}
                              {item.unit}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex font-mono justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Harga Beli
                            </span>
                            <span className="font-medium">
                              Rp{" "}
                              {Number(item.purchasePrice).toLocaleString(
                                "id-ID",
                              )}{" "}
                              / {item.unit}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex font-mono justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Keuntungan
                            </span>
                            <span className="font-medium text-primary flex items-center gap-1">
                              Rp{" "}
                              {Number(
                                (item.salePrice - item.purchasePrice) *
                                  item.stock,
                              ).toLocaleString("id-ID")}{" "}
                              <TrendingUp className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex justify-between gap-2 items-center">
                          <span className="text-xs text-muted-foreground font-medium">
                            Stok Tersedia
                          </span>
                          <div className="text-sm font-mono font-semibold flex items-baseline gap-1">
                            <NumberTicker
                              value={item.stock}
                              decimalPlaces={0}
                            />
                            <span className="text-xs text-muted-foreground font-normal">
                              / {item.minStock} {item.unit}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button variant={"secondary"}>
                            <SquareArrowOutUpRight className="text-primary" />{" "}
                            Edit
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-2 border rounded-lg bg-card">
          {searchQuery ? (
            <>
              <PackageSearch className="w-8 h-8 text-muted-foreground stroke-1" />
              <p className="text-sm font-medium">
                Tidak ada produk yang cocok dengan &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground">
                Coba periksa kata kunci atau gunakan ejaan lain.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetSearch}
                className="mt-2 text-xs"
              >
                Reset pencarian
              </Button>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">
              Tidak ada produk
            </span>
          )}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan halaman{" "}
            <span className="font-medium text-foreground">{meta.page}</span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">
              {meta.totalPages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1 || isSearching}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Halaman sebelumnya</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || isSearching}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Halaman selanjutnya</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
