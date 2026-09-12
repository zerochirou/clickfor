"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function PasswordChangeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
  });

  const revokeOtherSessionsValue = useWatch({
    control,
    name: "revokeOtherSessions",
    defaultValue: true,
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      const res = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: values.revokeOtherSessions,
      });

      if (res?.error) {
        throw new Error(
          res.error.message ||
            "Gagal mengubah kata sandi. Pastikan kata sandi saat ini benar.",
        );
      }

      toast.success("Kata sandi berhasil diperbarui!");
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah kata sandi",
      );
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
        Change password
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              Ganti Kata Sandi
            </DialogTitle>
            <DialogDescription>
              Perbarui kata sandi akun Anda untuk meningkatkan keamanan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                {...register("currentPassword")}
                className="rounded-lg"
                disabled={isSubmitting}
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Kata Sandi Baru</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...register("newPassword")}
                className="rounded-lg"
                disabled={isSubmitting}
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimal 8 karakter kombinasi huruf dan angka.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">
                Konfirmasi Kata Sandi Baru
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="rounded-lg"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex flex-col gap-0.5 pr-2">
                <Label
                  htmlFor="revokeOther"
                  className="text-xs font-medium cursor-pointer"
                >
                  Keluar dari perangkat lain
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Hentikan sesi aktif di browser atau perangkat lain
                </p>
              </div>
              <Switch
                id="revokeOther"
                checked={revokeOtherSessionsValue}
                onCheckedChange={(checked) =>
                  setValue("revokeOtherSessions", checked)
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg gap-2"
            >
              {isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                <Lock className="size-4" />
              )}
              Perbarui Kata Sandi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
