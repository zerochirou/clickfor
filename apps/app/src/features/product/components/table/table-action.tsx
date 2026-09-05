"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash2, Zap, ZapOff } from "lucide-react";
import { deleteProduct } from "../../api/delete-product";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProductOptimazOptimization } from "../../api/update-product";
import { useProducts } from "../../lib/products-provider";

export function TableAction({
  workspaceId,
  productId,
  isOptimized,
}: {
  workspaceId: string;
  productId: string;
  isOptimized: boolean;
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isOptimizedPending, startOptimizedTransition] = useTransition();
  const router = useRouter();
  const {
    updateProductOptimistic,
    removeProductOptimistic,
    setUpdatedProductId,
  } = useProducts();

  async function handleDelete() {
    startDeleteTransition(async () => {
      try {
        // Optimistic removal triggers smooth exit animation instantly
        removeProductOptimistic(productId);
        await deleteProduct({
          productId: productId,
          workspaceId: workspaceId,
        });
        router.refresh();
        toast.success("Produk berhasil dihapus");
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Gagal menghapus produk");
        router.refresh();
      }
    });
  }

  async function handleOptimization(currentOptimized: boolean) {
    const nextOptimized = !currentOptimized;

    // 1. Optimistic update and trigger row highlight pulse
    updateProductOptimistic(productId, { isUp: nextOptimized });
    setUpdatedProductId(productId);

    startOptimizedTransition(async () => {
      try {
        await updateProductOptimazOptimization({
          productId: productId,
          workspaceId: workspaceId,
          data: { isOptimized: nextOptimized },
        });
        router.refresh();
        toast.success(
          nextOptimized
            ? "Produk berhasil dioptimalkan"
            : "Produk tidak dioptimalkan",
        );
      } catch (error) {
        console.error("Failed to update optimization:", error);
        // Rollback state if server request fails
        updateProductOptimistic(productId, { isUp: currentOptimized });
        toast.error("Gagal memperbarui status optimasi produk");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Aksi Cepat</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleOptimization(isOptimized)}
            disabled={isOptimizedPending}
          >
            {isOptimizedPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-3.5" /> Menyimpan...
              </span>
            ) : isOptimized ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <ZapOff className="size-3.5" /> Berhenti dari optimasi
              </span>
            ) : (
              <span className="flex items-center gap-2 text-primary font-medium">
                <Zap className="size-3.5 fill-current" /> Optimalkan
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/workspace/${workspaceId}/product/${productId}/edit`)
            }
          >
            <span className="flex items-center gap-2">
              <Pencil className="size-3.5" /> Ubah
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeletePending}
          >
            {isDeletePending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-3.5" /> Menghapus...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="size-3.5" /> Hapus
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
