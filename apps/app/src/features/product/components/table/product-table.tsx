"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "../../lib/products-provider";
import { Product } from "@/lib/types/product";
import {
  ArrowBigUp,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  Package,
  PackageSearch,
  Tag,
  TextAlignStart,
  Zap,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CategoryTooltip } from "./category-tooltip";
import Image from "next/image";
import { TableAction } from "./table-action";
import { useWorkspace } from "@/features/workspace/lib/workspace-provider";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type SortKey =
  | "name"
  | "category"
  | "purchasePrice"
  | "salePrice"
  | "stock"
  | "isUp";

type SortOrder = "asc" | "desc";

interface ProductTableProps {
  products?: Product[];
}

function SortIcon({
  columnKey,
  activeKey,
  order,
}: {
  columnKey: SortKey;
  activeKey: SortKey | null;
  order: SortOrder | null;
}) {
  if (activeKey !== columnKey || !order) {
    return (
      <ChevronsUpDown className="size-3.5 opacity-30 group-hover/th:opacity-80 transition-opacity shrink-0" />
    );
  }
  return order === "asc" ? (
    <ArrowUp className="size-3.5 text-primary shrink-0 transition-transform" />
  ) : (
    <ArrowDown className="size-3.5 text-primary shrink-0 transition-transform" />
  );
}

export function ProductTable({ products: propProducts }: ProductTableProps) {
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

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortKey(null);
      setSortOrder(null);
    }
  };

  const sortedProducts = useMemo(() => {
    if (!sortKey || !sortOrder) return products;

    return [...products].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name, "id", {
            sensitivity: "base",
          });
          break;
        case "category": {
          const catA = a.category?.name ?? "";
          const catB = b.category?.name ?? "";
          comparison = catA.localeCompare(catB, "id", { sensitivity: "base" });
          break;
        }
        case "purchasePrice": {
          const priceA = Number(a.purchasePrice) || 0;
          const priceB = Number(b.purchasePrice) || 0;
          comparison = priceA - priceB;
          break;
        }
        case "salePrice": {
          const priceA = Number(a.salePrice) || 0;
          const priceB = Number(b.salePrice) || 0;
          comparison = priceA - priceB;
          break;
        }
        case "stock": {
          const stockA = a.stock ?? 0;
          const stockB = b.stock ?? 0;
          comparison = stockA - stockB;
          break;
        }
        case "isUp": {
          const upA = a.isUp ? 1 : 0;
          const upB = b.isUp ? 1 : 0;
          comparison = upA - upB;
          break;
        }
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [products, sortKey, sortOrder]);

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden">
        <Table className="rounded-2xl w-full overflow-x-auto">
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead
                className="h-12 px-4 font-medium cursor-pointer select-none group/th hover:text-foreground transition-colors"
                onClick={() => handleSort("name")}
                aria-sort={
                  sortKey === "name"
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span className="flex items-center gap-2">
                  <TextAlignStart className="w-4 h-4 text-muted-foreground" />
                  <span>Nama produk</span>
                  <SortIcon
                    columnKey="name"
                    activeKey={sortKey}
                    order={sortOrder}
                  />
                </span>
              </TableHead>
              <TableHead
                className="h-12 px-4 font-medium cursor-pointer select-none group/th hover:text-foreground transition-colors"
                onClick={() => handleSort("category")}
                aria-sort={
                  sortKey === "category"
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span>Kategori</span>
                  <SortIcon
                    columnKey="category"
                    activeKey={sortKey}
                    order={sortOrder}
                  />
                </span>
              </TableHead>
              <TableHead
                className="h-12 px-4 font-medium cursor-pointer select-none group/th hover:text-foreground transition-colors"
                onClick={() => handleSort("purchasePrice")}
                aria-sort={
                  sortKey === "purchasePrice"
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span className="flex items-center gap-2">
                  <ArrowBigUp className="w-4 h-4 text-muted-foreground" />
                  <span>Harga Beli</span>
                  <SortIcon
                    columnKey="purchasePrice"
                    activeKey={sortKey}
                    order={sortOrder}
                  />
                </span>
              </TableHead>
              <TableHead
                className="h-12 px-4 font-medium cursor-pointer select-none group/th hover:text-foreground transition-colors"
                onClick={() => handleSort("salePrice")}
                aria-sort={
                  sortKey === "salePrice"
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <span>Harga Jual</span>
                  <SortIcon
                    columnKey="salePrice"
                    activeKey={sortKey}
                    order={sortOrder}
                  />
                </span>
              </TableHead>
              <TableHead
                className="h-12 px-4 font-medium cursor-pointer select-none group/th hover:text-foreground transition-colors text-end w-24"
                onClick={() => handleSort("stock")}
                aria-sort={
                  sortKey === "stock"
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span className="flex items-center justify-end gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>Stok</span>
                  <SortIcon
                    columnKey="stock"
                    activeKey={sortKey}
                    order={sortOrder}
                  />
                </span>
              </TableHead>
              <TableHead
                className="h-12 px-4 font-medium cursor-pointer select-none group/th hover:text-foreground transition-colors"
                onClick={() => handleSort("isUp")}
                aria-sort={
                  sortKey === "isUp"
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span>Dioptimalkan</span>
                  <SortIcon
                    columnKey="isUp"
                    activeKey={sortKey}
                    order={sortOrder}
                  />
                </span>
              </TableHead>
              <TableHead className="h-12 px-4 font-medium text-end">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            className={
              isSearching
                ? "opacity-60 transition-opacity duration-200"
                : "transition-opacity duration-200"
            }
          >
            {isSearching && sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Spinner className="w-5 h-5 text-primary" />
                    <span className="text-sm">Mencari produk...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedProducts.length !== 0 ? (
              <AnimatePresence mode="popLayout" initial={false}>
                {sortedProducts.map((item) => {
                  const isJustUpdated = updatedProductId === item.id;
                  return (
                    <motion.tr
                      key={item.id}
                      layout="position"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -24,
                        filter: "blur(4px)",
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={cn(
                        "group border-b transition-colors duration-500",
                        isJustUpdated ? "bg-secondary" : "hover:bg-muted/50",
                      )}
                    >
                      <TableCell className="max-w-[280px]">
                        <Link
                          href={`/workspace/${workspace.id}/product/${item.id}`}
                          className="flex items-center gap-4 group/item cursor-pointer min-w-0"
                        >
                          {/* 3. Gunakan wrapper kaku (48px) dengan Next.js Image fill */}
                          <div className="relative w-12 h-12 min-w-[48px] min-h-[48px] shrink-0 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_S3_PRODUCT_BUCKET}/${item.image}`}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover/item:scale-105 transition-all"
                              unoptimized
                            />
                          </div>

                          {/* 4. Beri min-w-0 dan truncate agar teks tidak mendorong kolom */}
                          <div className="flex flex-col min-w-0 overflow-hidden">
                            <span className="font-semibold group-hover/item:text-primary transition-colors truncate">
                              {item.name}
                            </span>
                            <span className="opacity-50 text-xs font-mono truncate">
                              {item.sku}
                            </span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <CategoryTooltip
                          name={item.category.name}
                          description={item.category.description}
                          icon={item.category.icon}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          Rp{" "}
                          {Number(item.purchasePrice).toLocaleString("id-ID")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          Rp {item.salePrice.toLocaleString("id-ID")}
                        </span>
                      </TableCell>
                      <TableCell className="text-end">
                        <NumberTicker value={item.stock} decimalPlaces={0} />
                        <span> / </span>
                        <span className="opacity-50">{item.minStock}</span>
                      </TableCell>
                      <TableCell>
                        <AnimatePresence mode="wait" initial={false}>
                          {item.isUp ? (
                            <motion.div
                              key="optimized"
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="inline-flex"
                            >
                              <Badge
                                variant="default"
                                className="h-6 gap-1 shadow-xs bg-primary hover:bg-primary"
                              >
                                <span>Dioptimalkan</span>
                                <motion.span
                                  animate={{ rotate: [0, -15, 15, 0] }}
                                  transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                  <Zap className="size-3 fill-current" />
                                </motion.span>
                              </Badge>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="not-optimized"
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="inline-flex"
                            >
                              <Badge
                                variant="secondary"
                                className="h-6 text-muted-foreground"
                              >
                                Tidak dioptimalkan
                              </Badge>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </TableCell>
                      <TableCell className="text-end">
                        <TableAction
                          workspaceId={workspace.id}
                          productId={item.id}
                          isOptimized={Boolean(item.isUp)}
                        />
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  {searchQuery ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageSearch className="w-8 h-8 text-muted-foreground stroke-1" />
                      <p className="text-sm font-medium">
                        Tidak ada produk yang cocok dengan &quot;{searchQuery}
                        &quot;
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
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Tidak ada produk
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan halaman <span className="font-medium text-foreground">{meta.page}</span> dari{" "}
            <span className="font-medium text-foreground">{meta.totalPages}</span>
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
