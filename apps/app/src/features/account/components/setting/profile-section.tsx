"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { getAvatarPresignedUploadURL } from "../../api/get-avatar-presigned-url";
import { ImagePicker, CropResult } from "@/components/commons/image-picker";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { getStorageImageUrl } from "@/lib/storage-utils";

interface ProfileSectionProps {
  avatar: string | null;
  firstName: string;
  lastName: string;
  onAvatarChange: (newKey: string | null) => void;
  onFirstNameChange: (val: string) => void;
  onLastNameChange: (val: string) => void;
  disabled?: boolean;
}

export function ProfileSection({
  avatar,
  firstName,
  lastName,
  onAvatarChange,
  onFirstNameChange,
  onLastNameChange,
  disabled = false,
}: ProfileSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleCroppedImageSelected = async (result: CropResult) => {
    try {
      setIsUploading(true);

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

      // Update in Better Auth with storage file key
      await authClient.updateUser({
        image: fileKey,
      });

      onAvatarChange(fileKey);
      toast.success("Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah foto profil",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      await authClient.updateUser({
        image: "",
      });
      onAvatarChange(null);
      toast.success("Foto profil berhasil dihapus");
    } catch (error) {
      console.error("Remove avatar error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus foto profil",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const displayAvatar = getStorageImageUrl(avatar, "avatar");

  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <h2 className="text-xl font-bold text-foreground font-space-grostek">
        My Profile
      </h2>
      <div className="border-b border-border/70 mt-3 mb-6" />

      {/* Avatar & Action Row */}
      <div className="flex items-center gap-5">
        <div className="relative size-18 shrink-0">
          <Avatar className="size-18 border border-border shadow-xs">
            {displayAvatar && (
              <AvatarImage
                src={displayAvatar}
                alt="Profile photo"
                className="object-cover size-full"
              />
            )}
            <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center backdrop-blur-xs">
              <Spinner className="size-5 text-primary" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
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
                  onClick={openPicker}
                  disabled={isUploading || disabled}
                  className=" h-9 px-4 font-medium gap-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  Change Image
                </Button>
              )}
            </ImagePicker>

            {avatar && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleRemoveImage}
                disabled={isUploading || disabled}
                className=" h-9 px-4 font-medium bg-muted/80 hover:bg-muted text-foreground transition-colors"
              >
                Remove Image
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            We support PNGs, JPEGs and GIFs under 2MB
          </p>
        </div>
      </div>

      {/* First & Last Name Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-foreground"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="First name"
            disabled={disabled}
            className=" h-10 border-border/80 focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-foreground"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Last name"
            disabled={disabled}
            className=" h-10 border-border/80 focus-visible:ring-1"
          />
        </div>
      </div>
    </div>
  );
}
