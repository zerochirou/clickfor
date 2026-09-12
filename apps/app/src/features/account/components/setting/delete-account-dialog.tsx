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
import { authClient } from "@/lib/auth/auth-client";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  userEmail: string;
}

export function DeleteAccountDialog({ userEmail }: DeleteAccountDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationInput !== userEmail) {
      toast.error("Email konfirmasi tidak sesuai");
      return;
    }

    try {
      setIsDeleting(true);
      const res = await authClient.deleteUser({
        password: password || undefined,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Gagal menghapus akun");
      }

      toast.success("Akun berhasil dihapus.");
      setIsOpen(false);
      router.push("/signin");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus akun. Silakan coba lagi.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={<Button type="button" variant="destructive" className="" />}
      >
        Hapus Akun <Trash2 />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Konfirmasi Hapus Akun
          </DialogTitle>
          <DialogDescription>
            Tindakan ini <strong>tidak dapat dibatalkan</strong>. Semua data
            akun dan akses ke seluruh workspace akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmEmail" className="text-xs">
              Ketik email akun{" "}
              <strong className="text-foreground">{userEmail}</strong> untuk
              konfirmasi:
            </Label>
            <Input
              id="confirmEmail"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={userEmail}
              disabled={isDeleting}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="deletePassword" className="text-xs">
              Kata sandi Anda (jika login dengan email/password):
            </Label>
            <Input
              id="deletePassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            disabled={confirmationInput !== userEmail || isDeleting}
            onClick={handleDeleteAccount}
            className="gap-2 rounded-lg"
          >
            {isDeleting ? (
              <Spinner className="size-4" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Hapus Akun Selamanya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
