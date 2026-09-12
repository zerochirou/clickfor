"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getAvatarPresignedUploadURL } from "@/features/account/api/get-avatar-presigned-url";
import { ImagePicker, CropResult } from "@/components/commons/image-picker";
import { toast } from "sonner";
import Image from "next/image";

interface LogoUploaderProps {
  currentLogo?: string | null;
  onLogoChange: (url: string | null) => void;
}

export function LogoUploader({ currentLogo, onLogoChange }: LogoUploaderProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    currentLogo || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleCroppedLogoSelected = async (result: CropResult) => {
    try {
      setIsUploading(true);
      setLogoPreview(result.url);

      const presignedData = await getAvatarPresignedUploadURL({
        fileName: encodeURIComponent(result.file.name),
        contentType: encodeURIComponent(result.file.type || "image/webp"),
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
        throw new Error("Gagal mengunggah logo ke storage");
      }

      const finalLogoUrl = presignedData.publicUrl || presignedData.fileKey;
      setLogoPreview(finalLogoUrl);
      onLogoChange(finalLogoUrl);
      toast.success("Logo workspace berhasil diperbarui!");
    } catch (error) {
      console.error("Logo upload error:", error);
      setLogoPreview(currentLogo || null);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah logo",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setLogoPreview(null);
    onLogoChange(null);
    toast.success("Logo dihapus");
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        {/* Logo Preview Square with click trigger */}
        <ImagePicker
          onImageSelected={handleCroppedLogoSelected}
          cropShape="rect"
          aspectRatio={1}
          title="Sesuaikan Logo Workspace"
          description="Geser, perbesar, dan atur posisi logo workspace."
          disabled={isUploading}
        >
          {(openPicker) => (
            <div
              onClick={openPicker}
              className="size-16 rounded-2xl border border-border bg-muted/30 flex items-center justify-center overflow-hidden relative shrink-0 shadow-xs cursor-pointer group hover:border-primary/50 transition-colors"
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Company Logo"
                  width={64}
                  height={64}
                  className="size-full"
                  unoptimized
                />
              ) : (
                <svg
                  className="size-9 text-foreground group-hover:text-primary transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-xs">
                  <Spinner className="size-5 text-primary" />
                </div>
              )}
            </div>
          )}
        </ImagePicker>

        <ImagePicker
          onImageSelected={handleCroppedLogoSelected}
          cropShape="rect"
          aspectRatio={1}
          title="Sesuaikan Logo Workspace"
          description="Geser, perbesar, dan atur posisi logo workspace."
          disabled={isUploading}
        >
          {(openPicker) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={openPicker}
              className="h-9 px-4 rounded-xl font-medium"
            >
              {isUploading ? "Mengunggah..." : "Ganti Logo"}
            </Button>
          )}
        </ImagePicker>
      </div>

      {logoPreview && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
        >
          Remove
        </Button>
      )}
    </div>
  );
}
