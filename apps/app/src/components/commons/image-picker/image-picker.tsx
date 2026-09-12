"use client";

import React, { useId, useState } from "react";
import { toast } from "sonner";
import { ImageCropperModal } from "./image-cropper-modal";
import { CropResult } from "./crop-utils";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export interface ImagePickerProps {
  onImageSelected: (result: CropResult) => void;
  aspectRatio?: number;
  cropShape?: "circle" | "rect";
  maxSizeMB?: number;
  accept?: string;
  enableCrop?: boolean;
  title?: string;
  description?: string;
  disabled?: boolean;
  children?: React.ReactNode | ((openPicker: () => void) => React.ReactNode);
  className?: string;
}

export function ImagePicker({
  onImageSelected,
  aspectRatio = 1,
  cropShape = "circle",
  maxSizeMB = 5,
  accept = "image/png,image/jpeg,image/webp,image/gif",
  enableCrop = true,
  title,
  description,
  disabled = false,
  children,
  className,
}: ImagePickerProps) {
  const inputId = useId();
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] =
    useState<string>("image.webp");
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);

  const openPicker = () => {
    if (disabled) return;
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    input?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file melebihi batas maksimal (${maxSizeMB}MB)`);
      e.target.value = "";
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar");
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFileName(file.name);

    if (enableCrop) {
      setSelectedImageSrc(objectUrl);
      setIsCropperOpen(true);
    } else {
      onImageSelected({
        blob: file,
        file: file,
        url: objectUrl,
      });
    }

    // Reset file input value so same file can be re-selected
    e.target.value = "";
  };

  const handleCropComplete = (result: CropResult) => {
    setIsCropperOpen(false);
    setSelectedImageSrc(null);
    onImageSelected(result);
  };

  const handleCloseCropper = () => {
    setIsCropperOpen(false);
    setSelectedImageSrc(null);
  };

  return (
    <div className={className}>
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {typeof children === "function" ? (
        children(openPicker)
      ) : children ? (
        <div onClick={openPicker} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={openPicker}
          className="gap-2 rounded-xl"
        >
          <Upload className="size-4" />
          Pilih Gambar
        </Button>
      )}

      {enableCrop && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          imageSrc={selectedImageSrc}
          fileName={selectedFileName}
          aspectRatio={aspectRatio}
          cropShape={cropShape}
          title={title}
          description={description}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
