export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropResult {
  blob: Blob;
  file: File;
  url: string;
}

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function calculateRotatedSize(
  width: number,
  height: number,
  rotation: number,
) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Extracts the cropped area of an image using HTML5 Canvas and exports a Blob/File.
 */
export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  fileName = "cropped-image.webp",
  mimeType = "image/webp",
  quality = 0.92,
): Promise<CropResult> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Tidak dapat membuat konteks canvas 2D");
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of rotated image
  const { width: bBoxWidth, height: bBoxHeight } = calculateRotatedSize(
    image.naturalWidth,
    image.naturalHeight,
    rotation,
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central point on image to allow rotating around center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Create destination canvas with crop dimensions
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Tidak dapat membuat konteks cropped canvas");
  }

  // Desired max output dimension to preserve high quality without bloating size
  const maxOutputDim = 1200;
  let targetWidth = Math.max(1, Math.round(pixelCrop.width));
  let targetHeight = Math.max(1, Math.round(pixelCrop.height));

  if (targetWidth > maxOutputDim || targetHeight > maxOutputDim) {
    const ratio = Math.min(
      maxOutputDim / targetWidth,
      maxOutputDim / targetHeight,
    );
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  croppedCanvas.width = targetWidth;
  croppedCanvas.height = targetHeight;

  // Enable high quality image smoothing
  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = "high";

  // Draw cropped slice
  croppedCtx.drawImage(
    canvas,
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height),
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal mengonversi canvas ke Blob"));
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const file = new File([blob], fileName, {
          type: blob.type || mimeType,
          lastModified: Date.now(),
        });

        resolve({
          blob,
          file,
          url: objectUrl,
        });
      },
      mimeType,
      quality,
    );
  });
}
