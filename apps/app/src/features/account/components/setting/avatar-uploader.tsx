"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getAvatarPresignedUploadURL } from "../../api/get-avatar-presigned-url";
import { ImagePicker, CropResult } from "@/components/commons/image-picker";
import { Camera, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getStorageImageUrl } from "@/lib/storage-utils";

interface AvatarUploaderProps {
  currentAvatar?: string | null;
  name: string;
  onAvatarChange: (newKey: string | null) => void;
  disabled?: boolean;
}

export function AvatarUploader({
  currentAvatar,
  name,
  onAvatarChange,
  disabled = false,
}: AvatarUploaderProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentAvatar || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleCroppedImageSelected = async (result: CropResult) => {
    try {
      setIsUploading(true);
      setAvatarPreview(result.url); // Show local preview

      const presignedData = await getAvatarPresignedUploadURL({
        fileName: result.file.name,
        contentType: result.file.type || "image/webp",
      });

      if (!presignedData?.uploadURL) {
        throw new Error("Gagal membuat presigned upload URL");
      }

      const uploadRes = await fetch(presignedData.uploadURL, {
        method: "PUT",
        body: result.blob,
        headers: {
          "Content-Type": result.file.type || "image/webp",
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah gambar ke storage");
      }

      const fileKey = presignedData.fileKey;
      setAvatarPreview(fileKey);
      onAvatarChange(fileKey);
      toast.success("Foto profil berhasil diunggah!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      setAvatarPreview(currentAvatar || null);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah foto profil",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    onAvatarChange(null);
    toast.success("Foto profil dihapus");
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const displayAvatar = getStorageImageUrl(avatarPreview, "avatar");

  return (
    <div className="flex items-center justify-between w-full max-w-md">
      <div className="flex items-center gap-4">
        <ImagePicker
          onImageSelected={handleCroppedImageSelected}
          cropShape="circle"
          aspectRatio={1}
          title="Sesuaikan Foto Profil"
          description="Geser dan atur posisi foto profil Anda."
          disabled={isUploading || disabled}
        >
          {(openPicker) => (
            <div
              onClick={openPicker}
              className="size-16 rounded-full border border-border bg-muted/30 flex items-center justify-center overflow-hidden relative shrink-0 shadow-xs cursor-pointer group hover:border-primary/50 transition-colors"
            >
              <Avatar className="size-full">
                {displayAvatar && (
                  <AvatarImage
                    src={displayAvatar}
                    alt={name}
                    className="object-cover size-full"
                  />
                )}
                <AvatarFallback className="text-base font-bold bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center backdrop-blur-xs">
                  <Spinner className="size-5 text-primary" />
                </div>
              )}

              <div
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                title="Ubah Foto"
              >
                <Camera className="size-4" />
              </div>
            </div>
          )}
        </ImagePicker>

        <ImagePicker
          onImageSelected={handleCroppedImageSelected}
          cropShape="circle"
          aspectRatio={1}
          title="Sesuaikan Foto Profil"
          description="Geser dan atur posisi foto profil Anda."
          disabled={isUploading || disabled}
        >
          {(openPicker) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading || disabled}
              onClick={openPicker}
              className="h-9 px-4 rounded-xl font-medium gap-2"
            >
              <Upload className="size-3.5" />
              {isUploading ? "Mengunggah..." : "Ganti Foto"}
            </Button>
          )}
        </ImagePicker>
      </div>

      {avatarPreview && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isUploading || disabled}
          onClick={handleRemoveAvatar}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
        >
          <Trash2 className="size-3.5 mr-1" />
          Hapus
        </Button>
      )}
    </div>
  );
}
