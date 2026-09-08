"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ProductCategory } from "@/lib/types/product";
import { deleteProductCategory } from "../../api/delete-product-category";

interface CategoryTableActionProps {
  category: ProductCategory;
  workspaceId: string;
  onEdit: (category: ProductCategory) => void;
  onDeleteSuccess: (categoryId: string) => void;
}

export function CategoryTableAction({
  category,
  workspaceId,
  onEdit,
  onDeleteSuccess,
}: CategoryTableActionProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      try {
        await deleteProductCategory({
          workspaceId,
          categoryId: category.id,
        });

        toast.success(`Kategori "${category.name}" berhasil dihapus`);
        setIsDeleteDialogOpen(false);
        onDeleteSuccess(category.id);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal menghapus kategori. Pastikan tidak ada produk aktif yang bergantung.",
        );
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon-xs"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Aksi untuk {category.name}</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Aksi Kategori</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onEdit(category)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Kategori</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              <span>Hapus Kategori</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Hapus Kategori
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori{" "}
              <strong className="text-foreground">
                {category.icon} {category.name}
              </strong>
              ?
              {(category.productCount || 0) > 0 && (
                <span className="block mt-2 font-medium text-amber-600 dark:text-amber-400">
                  Perhatian: Kategori ini masih memiliki {category.productCount}{" "}
                  produk terkait.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  Menghapus <Spinner className="ml-2" />
                </>
              ) : (
                "Hapus Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
