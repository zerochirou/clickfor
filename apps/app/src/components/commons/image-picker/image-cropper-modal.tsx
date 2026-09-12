"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Crop as CropIcon,
} from "lucide-react";
import {
  calculateRotatedSize,
  getCroppedImage,
  CropResult,
  PixelCrop,
} from "./crop-utils";

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  aspectRatio?: number; // e.g., 1 for square/circle, 16/9 for wide
  cropShape?: "circle" | "rect";
  title?: string;
  description?: string;
  onClose: () => void;
  onCropComplete: (result: CropResult) => void;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = "image.webp",
  aspectRatio = 1,
  cropShape = "circle",
  title = "Sesuaikan Gambar",
  description = "Geser, perbesar, dan putar gambar untuk menyesuaikan posisi.",
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when image changes during render
  const [prevImageSrc, setPrevImageSrc] = useState(imageSrc);
  if (imageSrc !== prevImageSrc) {
    setPrevImageSrc(imageSrc);
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  }

  // Pointer drag events for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) =>
      Math.min(3, Math.max(0.5, Number((prev + delta).toFixed(2)))),
    );
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !imgRef.current || !containerRef.current) return;

    try {
      setIsProcessing(true);

      const img = imgRef.current;
      const containerRect = containerRef.current.getBoundingClientRect();

      // Crop viewport box size inside container
      const containerSize = Math.min(containerRect.width, containerRect.height);
      const cropSize = containerSize * 0.78; // Crop area is 78% of container
      const cropWidth = cropSize;
      const cropHeight = cropSize / aspectRatio;

      // Rotated natural dimensions
      const { width: bBoxWidth, height: bBoxHeight } = calculateRotatedSize(
        img.naturalWidth,
        img.naturalHeight,
        rotation,
      );

      // Scale ratio between displayed image on screen and bounding box of image
      // Displayed base fit size
      const fitScale = Math.max(cropWidth / bBoxWidth, cropHeight / bBoxHeight);
      const totalScale = fitScale * zoom;

      // Crop box center in rotated image space
      // Container center is (0,0) with pan offset
      const cropCenterScreenX = containerRect.width / 2;
      const cropCenterScreenY = containerRect.height / 2;

      const imgCenterScreenX = cropCenterScreenX + pan.x;
      const imgCenterScreenY = cropCenterScreenY + pan.y;

      const deltaXScreen = cropCenterScreenX - imgCenterScreenX;
      const deltaYScreen = cropCenterScreenY - imgCenterScreenY;

      // Convert to image bounding-box natural coordinates
      const naturalDeltaX = deltaXScreen / totalScale;
      const naturalDeltaY = deltaYScreen / totalScale;

      const naturalCropWidth = cropWidth / totalScale;
      const naturalCropHeight = cropHeight / totalScale;

      const pixelCrop: PixelCrop = {
        x: Math.max(0, bBoxWidth / 2 + naturalDeltaX - naturalCropWidth / 2),
        y: Math.max(0, bBoxHeight / 2 + naturalDeltaY - naturalCropHeight / 2),
        width: Math.min(bBoxWidth, naturalCropWidth),
        height: Math.min(bBoxHeight, naturalCropHeight),
      };

      const result = await getCroppedImage(
        imageSrc,
        pixelCrop,
        rotation,
        fileName.replace(/\.[^/.]+$/, "") + ".webp",
        "image/webp",
        0.92,
      );

      onCropComplete(result);
      onClose();
    } catch (error) {
      console.error("Failed to crop image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-background gap-0 rounded-3xl border border-border shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div>
              <DialogTitle className="text-base font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Viewport & Interactive Stage */}
        <div className="p-4 flex flex-col items-center gap-4 bg-muted/20">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative w-full h-72 sm:h-80 bg-neutral-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center border border-border/80 shadow-inner"
          >
            {/* Background Checker Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />

            {/* The Image */}
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                  maxHeight: "75%",
                  maxWidth: "75%",
                  objectFit: "contain",
                }}
                className="pointer-events-none origin-center user-select-none"
              />
            )}

            {/* Dark Mask Overlay with Cutout */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`relative shadow-[0_0_0_9999px_rgba(0,0,0,0.68)] border-2 border-white/90 ${
                  cropShape === "circle" ? "rounded-full" : "rounded-2xl"
                }`}
                style={{
                  width: "220px",
                  height: `${220 / aspectRatio}px`,
                }}
              >
                {/* Rule of Thirds Grid */}
                <div
                  className={`absolute inset-0 grid grid-cols-3 grid-rows-3 transition-opacity duration-200 ${
                    isDragging ? "opacity-40" : "opacity-20"
                  }`}
                >
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-b border-white/60" />
                  <div className="border-r border-white/60" />
                  <div className="border-r border-white/60" />
                  <div />
                </div>
              </div>
            </div>

            {/* Panning Hint Badge */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white/80 pointer-events-none flex items-center gap-1.5">
              <span>Tahan & geser gambar</span>
            </div>
          </div>

          {/* Controls Toolbar */}
          <div className="w-full flex flex-col gap-3 px-1">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3 w-full">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setZoom((prev) =>
                    Math.max(0.5, Number((prev - 0.1).toFixed(1))),
                  )
                }
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                title="Perkecil"
              >
                <ZoomOut className="size-4" />
              </Button>

              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-[11px] font-mono text-muted-foreground w-9 text-right shrink-0">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setZoom((prev) =>
                    Math.min(3, Number((prev + 0.1).toFixed(1))),
                  )
                }
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                title="Perbesar"
              >
                <ZoomIn className="size-4" />
              </Button>
            </div>

            {/* Action Tools (Rotate, Reset) */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRotateLeft}
                  className="h-7 px-2.5 rounded-lg text-xs gap-1.5"
                  title="Putar 90° ke kiri"
                >
                  <RotateCcw className="size-3.5" />
                  <span className="text-[11px] hidden sm:inline">-90°</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRotateRight}
                  className="h-7 px-2.5 rounded-lg text-xs gap-1.5"
                  title="Putar 90° ke kanan"
                >
                  <RotateCw className="size-3.5" />
                  <span className="text-[11px] hidden sm:inline">+90°</span>
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1.5"
              >
                <RefreshCw className="size-3.5" />
                <span className="text-[11px]">Reset</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border/60 flex items-center justify-end gap-2 bg-background">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl px-4 h-9"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApplyCrop}
            disabled={isProcessing || !imageSrc}
            className="rounded-xl px-5 h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isProcessing ? (
              <Spinner className="size-4" />
            ) : (
              <CropIcon className="size-4" />
            )}
            Terapkan & Potong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
