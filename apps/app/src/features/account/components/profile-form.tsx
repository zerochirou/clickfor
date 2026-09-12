"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { AvatarUpload } from "./avatar-upload";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Save, Calendar, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt?: Date | string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentImage, setCurrentImage] = useState<string | null>(
    user.image || null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const onSubmit = async (values: UpdateProfileValues) => {
    try {
      const res = await authClient.updateUser({
        name: values.name,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Gagal memperbarui profil");
      }

      toast.success("Profil berhasil diperbarui!");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui profil",
      );
    }
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Picture Card */}
      <Card>
        <CardHeader>
          <CardTitle>Foto Profil</CardTitle>
          <CardDescription>
            Foto profil ini akan ditampilkan di menu navigasi, workspace, dan
            halaman akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentImage={currentImage}
            name={user.name || "User"}
            onImageUpdated={(newUrl) => setCurrentImage(newUrl)}
          />
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
            <CardDescription>
              Perbarui nama tampilan dan kelola identitas akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap Anda"
                {...register("name")}
                className="max-w-md"
                disabled={isSubmitting || isPending}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email (Read-only + verification status) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between max-w-md">
                <Label htmlFor="email" className="text-sm font-medium">
                  Alamat Email
                </Label>
                {user.emailVerified ? (
                  <Badge
                    variant="default"
                    className="gap-1 bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30"
                  >
                    <CheckCircle2 className="size-3" />
                    Terverifikasi
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="size-3" />
                    Belum Terverifikasi
                  </Badge>
                )}
              </div>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="max-w-md bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email terdaftar digunakan sebagai identifikasi akun dan login
                utama.
              </p>
            </div>

            <Separator className="my-2" />

            {/* Meta info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span>
                  Bergabung sejak:{" "}
                  <strong className="text-foreground">{formattedDate}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="size-4 text-primary" />
                <span className="truncate">
                  ID:{" "}
                  <code className="font-mono text-foreground">{user.id}</code>
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting || isPending}
              className="gap-2"
            >
              {isSubmitting || isPending ? (
                <Spinner className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
