"use client";

import { useState } from "react";
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
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, LogOut } from "lucide-react";
import { handleLogout } from "@/features/auth/lib/handle-logout";

interface AccountDangerCardProps {
  userEmail: string;
}

export function AccountDangerCard({ userEmail }: AccountDangerCardProps) {
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
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          <CardTitle>Zona Berbahaya</CardTitle>
        </div>
        <CardDescription>
          Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* 1. Logout Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">Keluar dari Akun</span>
            <p className="text-xs text-muted-foreground">
              Akhiri sesi login Anda saat ini di browser ini.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleLogout(router)}
            className="gap-2 shrink-0 rounded-xl font-medium"
          >
            <LogOut className="size-4" />
            Keluar
          </Button>
        </div>

        {/* 2. Delete Account Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-card">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-destructive">
              Hapus Akun Permanen
            </span>
            <p className="text-xs text-muted-foreground">
              Menghapus profil Anda, riwayat sesi, dan seluruh data yang terkait
              secara permanen.
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-2 shrink-0 rounded-xl font-medium"
                />
              }
            >
              <Trash2 className="size-4" />
              Hapus Akun
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Konfirmasi Hapus Akun
                </DialogTitle>
                <DialogDescription>
                  Tindakan ini <strong>tidak dapat dibatalkan</strong>. Semua
                  data akun dan profil Anda akan hilang selamanya.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmEmail" className="text-xs">
                    Ketik email akun{" "}
                    <strong className="text-foreground">{userEmail}</strong>{" "}
                    untuk konfirmasi:
                  </Label>
                  <Input
                    id="confirmEmail"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    placeholder={userEmail}
                    disabled={isDeleting}
                    className="rounded-xl"
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
                    className="rounded-xl"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={confirmationInput !== userEmail || isDeleting}
                  onClick={handleDeleteAccount}
                  className="gap-2 rounded-xl"
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
        </div>
      </CardContent>
    </Card>
  );
}
