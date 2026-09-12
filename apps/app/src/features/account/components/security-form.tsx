"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, LogOut, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

export function SecurityForm() {
  const [isRevokingOther, setIsRevokingOther] = useState(false);

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
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah kata sandi",
      );
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      setIsRevokingOther(true);
      const res = await authClient.revokeOtherSessions();

      if (res?.error) {
        throw new Error(
          res.error.message || "Gagal menghentikan sesi perangkat lain",
        );
      }

      toast.success("Semua sesi perangkat lain telah berhasil dihentikan.");
    } catch (error) {
      console.error("Revoke sessions error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghentikan sesi perangkat lain",
      );
    } finally {
      setIsRevokingOther(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Change Password Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              <CardTitle>Ganti Kata Sandi</CardTitle>
            </div>
            <CardDescription>
              Pastikan akun Anda menggunakan kata sandi yang panjang dan acak
              untuk menjaga keamanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                {...register("currentPassword")}
                className="max-w-md"
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
                className="max-w-md"
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
                className="max-w-md"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between max-w-md pt-2">
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor="revokeOther"
                  className="text-sm font-medium cursor-pointer"
                >
                  Keluar dari perangkat lain
                </Label>
                <p className="text-xs text-muted-foreground">
                  Hentikan semua sesi aktif lainnya setelah kata sandi diubah
                </p>
              </div>
              <Switch
                id="revokeOther"
                checked={revokeOtherSessionsValue}
                onCheckedChange={(checked) =>
                  setValue("revokeOtherSessions", checked)
                }
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                <Lock className="size-4" />
              )}
              Perbarui Kata Sandi
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Device & Session Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <CardTitle>Sesi & Keamanan Perangkat</CardTitle>
          </div>
          <CardDescription>
            Kelola sesi login aktif di akun Anda pada berbagai browser atau
            perangkat.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-muted/40">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">
                Sesi di Perangkat Lain
              </span>
              <p className="text-xs text-muted-foreground">
                Jika Anda merasa pernah login di perangkat umum atau perangkat
                lain yang tidak lagi digunakan, Anda dapat mengeluarkan semua
                sesi tersebut secara instan.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isRevokingOther}
              onClick={handleRevokeOtherSessions}
              className="shrink-0 gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              {isRevokingOther ? (
                <Spinner className="size-4" />
              ) : (
                <LogOut className="size-4" />
              )}
              Keluar dari Perangkat Lain
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
