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
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChangeEmailDialogProps {
  currentEmail: string;
}

export function ChangeEmailDialog({ currentEmail }: ChangeEmailDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Silakan masukkan alamat email yang valid");
      return;
    }

    if (newEmail === currentEmail) {
      toast.error("Email baru harus berbeda dari email saat ini");
      return;
    }

    try {
      setIsPending(true);
      const res = await authClient.changeEmail({
        newEmail: newEmail.trim(),
        callbackURL: "/account",
      });

      if (res?.error) {
        throw new Error(res.error.message || "Gagal mengubah email");
      }

      toast.success("Instruksi verifikasi telah dikirim ke email baru!");
      setIsOpen(false);
      setNewEmail("");
      router.refresh();
    } catch (error) {
      console.error("Change email error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah email",
      );
    } finally {
      setIsPending(false);
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
        Change email
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
              Ganti Alamat Email
            </DialogTitle>
            <DialogDescription>
              Masukkan alamat email baru Anda. Kami akan mengirimkan tautan
              konfirmasi ke email tersebut.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currEmail" className="text-xs">
                Email Saat Ini
              </Label>
              <Input
                id="currEmail"
                value={currentEmail}
                disabled
                className="bg-muted text-muted-foreground rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newEmail" className="text-xs">
                Email Baru
              </Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="nama@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isPending}
                className="rounded-lg"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || !newEmail}
              className="rounded-lg gap-2"
            >
              {isPending && <Spinner className="size-4" />}
              Kirim Konfirmasi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
