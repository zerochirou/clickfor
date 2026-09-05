"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useProducts } from "../../lib/products-provider";
import { Product } from "@/lib/types/product";
import {
  ArrowBigUp,
  Coins,
  DecimalsArrowRight,
  Package,
  Tag,
  TextAlignStart,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CategoryTooltip } from "./category-tooltip";
import Image from "next/image";
import { TableAction } from "./table-action";
import { useWorkspace } from "@/features/workspace/lib/workspace-provider";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const { workspace } = useWorkspace();
  return (
    <div className="space-y-4">
      <Card className="p-0">
        <Table className="rounded-2xl">
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent opacity-50">
              <TableHead className="h-12 px-4 font-medium">
                <span className="flex items-center gap-2">
                  <TextAlignStart className="w-4 h-4" /> Nama produk
                </span>
              </TableHead>
              <TableHead className="h-12 px-4 font-medium">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Kategori
                </span>
              </TableHead>
              <TableHead className="h-12 px-4 font-medium">
                <span className="flex items-center gap-2">
                  <ArrowBigUp className="w-4 h-4" /> Harga Beli
                </span>
              </TableHead>
              <TableHead className="h-12 px-4 font-medium">
                <span className="flex items-center gap-2">
                  <Coins className="w-4 h-4" /> Harga Jual
                </span>
              </TableHead>
              <TableHead className="h-12 px-4 font-medium text-end w-20">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4" /> Stok
                </span>
              </TableHead>
              <TableHead className="h-12 px-4 font-medium">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Dioptimalkan
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length !== 0 ? (
              <>
                {products.map((item) => {
                  return (
                    <TableRow key={item.id} className="group">
                      <TableCell>
                        <span className="flex items-center gap-4">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_S3_PRODUCT_BUCKET}/${item.image}`}
                            alt={item.name}
                            className="rounded-sm"
                            width={50}
                            height={50}
                            unoptimized
                          />
                          <span className="flex flex-col">
                            <span className="font-semibold group-hover:text-primary transition-all ease-in-out">{item.name}</span>
                            <span className="opacity-50">{item.sku}</span>
                          </span>
                        </span>
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
                        <span className=" text-sm font-medium">
                          Rp {item.salePrice.toLocaleString("id-ID")}
                        </span>
                      </TableCell>
                      <TableCell className="text-end">
                        <NumberTicker value={item.stock} decimalPlaces={0} />
                        <span> / </span>
                        <span className="opacity-50">{item.minStock}</span>
                      </TableCell>
                      <TableCell>
                        {item.isUp ? (
                          <Badge variant={'outline'} className="bg-primary-blue">
                            Dioptimalkan <Zap />
                          </Badge>
                        ) : (
                          <Badge variant={"outline"}>Tidak dioptimalkan</Badge>
                        )}
                      </TableCell>
                      <TableCell className="">
                        <TableAction
                          workspaceId={workspace.id}
                          productId={item.id}
                          isOptimized={item.isUp}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Tidak ada produk
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
