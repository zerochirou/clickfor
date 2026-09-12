"use client";

import { useState } from "react";
import { Workspace } from "@/lib/types/workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteWorkspace } from "../../api/delete-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkspaceDangerCardProps {
  workspace: Workspace;
}

export function WorkspaceDangerCard({ workspace }: WorkspaceDangerCardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmationInput !== workspace.workspaceName) {
      toast.error("Nama workspace konfirmasi tidak sesuai");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteWorkspace(workspace.id);
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
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          <CardTitle>Zona Berbahaya</CardTitle>
        </div>
        <CardDescription>
          Tindakan ini permanen. Semua data produk, kategori, menu, dan riwayat
          di workspace ini akan dihapus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-card">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-destructive">
              Hapus Workspace Ini
            </span>
            <p className="text-xs text-muted-foreground">
              Hapus workspace &quot;{workspace.workspaceName}&quot; secara
              permanen dari akun Anda.
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-2 shrink-0"
                />
              }
            >
              <Trash2 className="size-4" />
              Hapus Workspace
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Konfirmasi Hapus Workspace
                </DialogTitle>
                <DialogDescription>
                  Tindakan ini <strong>tidak dapat dibatalkan</strong>. Semua
                  produk, kategori, dan pengaturan di workspace ini akan hilang
                  selamanya.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 py-2">
                <Label htmlFor="confirmName" className="text-xs">
                  Ketik nama workspace{" "}
                  <strong className="text-foreground">
                    {workspace.workspaceName}
                  </strong>{" "}
                  untuk konfirmasi:
                </Label>
                <Input
                  id="confirmName"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={workspace.workspaceName}
                  disabled={isDeleting}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={
                    confirmationInput !== workspace.workspaceName || isDeleting
                  }
                  onClick={handleDelete}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Hapus Selamanya
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
