"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { getAvatarPresignedUploadURL } from "../api/get-avatar-presigned-url";
import { ImagePicker, CropResult } from "@/components/commons/image-picker";
import { Camera, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getStorageImageUrl } from "@/lib/storage-utils";

interface AvatarUploadProps {
  currentImage?: string | null;
  name: string;
  onImageUpdated?: (newImageKey: string | null) => void;
}

export function AvatarUpload({
  currentImage,
  name,
  onImageUpdated,
}: AvatarUploadProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentImage || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCroppedImageSelected = async (result: CropResult) => {
    try {
      setIsUploading(true);
      setImagePreview(result.url); // Show local preview during upload

      // 1. Get presigned upload URL from server
      const presignedData = await getAvatarPresignedUploadURL({
        fileName: result.file.name,
        contentType: result.file.type || "image/webp",
      });

      if (!presignedData?.uploadURL) {
        throw new Error("Gagal membuat presigned upload URL");
      }

      // 2. Upload cropped file directly to RustFS S3 storage
      const uploadRes = await fetch(presignedData.uploadURL, {
        method: "PUT",
        body: result.blob,
        headers: {
          "Content-Type": result.file.type || "image/webp",
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file gambar ke storage");
      }

      // 3. Update profile image in Better Auth using fileKey
      const fileKey = presignedData.fileKey;
      const res = await authClient.updateUser({
        image: fileKey,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Gagal memperbarui profil");
      }

      setImagePreview(fileKey);
      onImageUpdated?.(fileKey);
      toast.success("Foto profil berhasil diperbarui!");

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      setImagePreview(currentImage || null);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengunggah foto profil",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      const res = await authClient.updateUser({
        image: "",
      });

      if (res?.error) {
        throw new Error(res.error.message || "Gagal menghapus foto profil");
      }

      setImagePreview(null);
      onImageUpdated?.(null);
      toast.success("Foto profil berhasil dihapus");

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Avatar remove error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus foto profil",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const displayAvatar = getStorageImageUrl(imagePreview, "avatar");

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Avatar with Crop Trigger */}
      <ImagePicker
        onImageSelected={handleCroppedImageSelected}
        cropShape="circle"
        aspectRatio={1}
        title="Sesuaikan Foto Profil"
        description="Geser dan atur posisi foto profil Anda."
        disabled={isUploading || isPending}
      >
        {(openPicker) => (
          <div className="relative group cursor-pointer" onClick={openPicker}>
            <Avatar className="size-24 border-2 border-border shadow-sm">
              {displayAvatar && (
                <AvatarImage
                  src={displayAvatar}
                  alt={name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isUploading && (
              <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center backdrop-blur-xs">
                <Spinner className="size-6 text-primary" />
              </div>
            )}

            <div
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              title="Ubah Foto"
            >
              <Camera className="size-6" />
            </div>
          </div>
        )}
      </ImagePicker>

      <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
        <div className="flex flex-wrap gap-2">
          <ImagePicker
            onImageSelected={handleCroppedImageSelected}
            cropShape="circle"
            aspectRatio={1}
            title="Sesuaikan Foto Profil"
            description="Geser dan atur posisi foto profil Anda."
            disabled={isUploading || isPending}
          >
            {(openPicker) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading || isPending}
                onClick={openPicker}
                className="gap-2 rounded-xl font-medium"
              >
                <Upload className="size-4" />
                Unggah Foto
              </Button>
            )}
          </ImagePicker>

          {imagePreview && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isUploading || isPending}
              onClick={handleRemoveAvatar}
              className="gap-2 rounded-xl"
            >
              <Trash2 className="size-4" />
              Hapus
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Format: JPG, PNG, WebP, atau GIF. Dilengkapi editor crop interaktif &
          disimpan di S3.
        </p>
      </div>
    </div>
  );
}
