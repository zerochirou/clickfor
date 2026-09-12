"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { getAvatarPresignedUploadURL } from "@/features/account/api/get-avatar-presigned-url";
import { ImagePicker, CropResult } from "@/components/commons/image-picker";
import { BrandColorPicker } from "./brand-color-picker";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface WorkspaceProfileSectionProps {
  logo: string | null;
  workspaceName: string;
  brandColor: string;
  description: string;
  onLogoChange: (newLogo: string | null) => void;
  onWorkspaceNameChange: (val: string) => void;
  onBrandColorChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  disabled?: boolean;
}

export function WorkspaceProfileSection({
  logo,
  workspaceName,
  brandColor,
  description,
  onLogoChange,
  onWorkspaceNameChange,
  onBrandColorChange,
  onDescriptionChange,
  disabled = false,
}: WorkspaceProfileSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleCroppedLogoSelected = async (result: CropResult) => {
    try {
      setIsUploading(true);

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
      onLogoChange(finalLogoUrl);
      toast.success("Logo workspace berhasil diunggah!");
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah logo",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    toast.success("Logo dihapus");
  };

  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <h2 className="text-xl font-bold text-foreground font-space-grostek">
        Workspace Profile
      </h2>
      <div className="border-b border-border/70 mt-3 mb-6" />

      {/* Logo & Action Row */}
      <div className="flex items-center gap-5">
        <div className="relative size-18 rounded-2xl border border-border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
          {logo ? (
            <Image
              src={logo}
              alt="Workspace logo"
              width={72}
              height={72}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <svg
              className="size-8 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          )}

          {isUploading && (
            <div className="absolute inset-0 rounded-2xl bg-background/80 flex items-center justify-center backdrop-blur-xs">
              <Spinner className="size-5 text-primary" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <ImagePicker
              onImageSelected={handleCroppedLogoSelected}
              cropShape="rect"
              aspectRatio={1}
              title="Sesuaikan Logo Workspace"
              description="Geser, perbesar, dan atur posisi logo workspace."
              disabled={isUploading || disabled}
            >
              {(openPicker) => (
                <Button
                  type="button"
                  onClick={openPicker}
                  disabled={isUploading || disabled}
                  className="rounded-lg h-9 px-4 font-medium gap-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  Change Logo
                </Button>
              )}
            </ImagePicker>

            {logo && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleRemoveLogo}
                disabled={isUploading || disabled}
                className="rounded-lg h-9 px-4 font-medium bg-muted/80 hover:bg-muted text-foreground transition-colors"
              >
                Remove Logo
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            We support PNGs, JPEGs and SVG under 2MB
          </p>
        </div>
      </div>

      {/* Workspace Name & Brand Color Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="wsName"
            className="text-sm font-medium text-foreground"
          >
            Workspace Name
          </Label>
          <Input
            id="wsName"
            value={workspaceName}
            onChange={(e) => onWorkspaceNameChange(e.target.value)}
            placeholder="Contoh: Toko Kopi Senja"
            disabled={disabled}
            className="rounded-lg h-10 border-border/80 focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-foreground">
            Brand Color
          </Label>
          <BrandColorPicker color={brandColor} onChange={onBrandColorChange} />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mt-5">
        <Label htmlFor="wsDesc" className="text-sm font-medium text-foreground">
          Workspace Description
        </Label>
        <Textarea
          id="wsDesc"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Tulis deskripsi singkat mengenai ruang kerja ini..."
          rows={3}
          disabled={disabled}
          className="rounded-lg border-border/80 focus-visible:ring-1 resize-none"
        />
      </div>
    </div>
  );
}
