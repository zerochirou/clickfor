"use client";

import { Badge } from "@/components/ui/badge";
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
import { Ellipsis } from "lucide-react";
import { deleteProduct } from "../../api/delete-product";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProductOptimazOptimization } from "../../api/update-product";

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
  async function handleDelete() {
    startDeleteTransition(async () => {
      await deleteProduct({
        productId: productId,
        workspaceId: workspaceId,
      });
      router.refresh();
      toast.success("Produk berhasil dihapus");
    });
  }

  async function handleOptimization(isOptimized: boolean) {
    startOptimizedTransition(async () => {
      console.log(!isOptimized)
      await updateProductOptimazOptimization({
        productId: productId,
        workspaceId: workspaceId,
        data: { isOptimized: !isOptimized },
      });
      router.refresh();
      toast.success(`${isOptimized ? "Produk berhasil dioptimalkan" : "Produk tidak dioptimalkan"}`);
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Aksi Cepat</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleOptimization(isOptimized)}>
            {isOptimizedPending ? (
              <>
                Loading <Spinner />
              </>
            ) : (
              <>{isOptimized ? "Optimalkan" : "Nonaktifkan"}</>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Ubah</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            {isDeletePending ? (
              <>
                Loading <Spinner />
              </>
            ) : (
              <>Hapus</>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
