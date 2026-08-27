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

export function TableAction({
  workspaceId,
  productId,
}: {
  workspaceId: string;
  productId: string;
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Aksi Cepat</DropdownMenuLabel>
          <DropdownMenuItem>Nonaktifkan</DropdownMenuItem>
          <DropdownMenuItem>Optimalkan</DropdownMenuItem>
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
