"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteWorkspace } from "../../api/delete-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkspaceDeleteDialogProps {
  workspaceId: string;
  workspaceName: string;
}

export function WorkspaceDeleteDialog({
  workspaceId,
  workspaceName,
}: WorkspaceDeleteDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmationInput !== workspaceName) {
      toast.error("Nama workspace konfirmasi tidak sesuai");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteWorkspace(workspaceId);
      toast.success("Workspace berhasil dihapus");
      setIsOpen(false);
      router.push("/workspace");
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus workspace",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            className="rounded-lg h-9 px-4 font-medium bg-muted/80 hover:bg-muted text-foreground shrink-0"
          />
        }
      >
        Delete Workspace
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Konfirmasi Hapus Workspace
          </DialogTitle>
          <DialogDescription>
            Tindakan ini <strong>tidak dapat dibatalkan</strong>. Semua produk,
            kategori, menu, dan data di workspace ini akan hilang selamanya.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmName" className="text-xs">
              Ketik nama workspace{" "}
              <strong className="text-foreground">{workspaceName}</strong> untuk
              konfirmasi:
            </Label>
            <Input
              id="confirmName"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={workspaceName}
              disabled={isDeleting}
              className="rounded-lg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="rounded-lg"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={confirmationInput !== workspaceName || isDeleting}
            onClick={handleDelete}
            className="gap-2 rounded-lg"
          >
            {isDeleting ? (
              <Spinner className="size-4" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Hapus Workspace Selamanya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
