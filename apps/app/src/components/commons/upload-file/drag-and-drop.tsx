'use client';

import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ubah tipe file valid menjadi gambar (JPEG, PNG, WebP)
  const validFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (validFileTypes.includes(file.type)) {
      setUploadState({ file, progress: 0, uploading: true });
      if (onFileSelect) onFileSelect(file); // Kirim file ke parent form

      const interval = setInterval(() => {
        setUploadState((prev) => {
          const newProgress = prev.progress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...prev, progress: 100, uploading: false };
          }
          return { ...prev, progress: newProgress };
        });
      }, 150);
    } else {
      toast.error('Format file tidak didukung. Harap unggah gambar (PNG, JPG, JPEG, WebP).', {
        position: 'bottom-right',
        duration: 3000,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) onFileSelect(null); // Reset file di parent form
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  const { file, progress, uploading } = uploadState;

  return (
    <div className="">
      <div className="w-full">
        <div
          className="mt-2 flex justify-center rounded-2xl border border-input border-dashed px-6 py-8 hover:bg-muted/50 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <ImageIcon
              aria-hidden={true}
              className="mx-auto h-10 w-10 text-muted-foreground"
            />
            <div className="mt-4 flex text-muted-foreground text-sm leading-6 justify-center">
              <span className="font-medium text-primary hover:underline">
                Klik untuk unggah
              </span>
              <p className="pl-1">atau seret dan lepas di sini</p>
              <input
                accept="image/png, image/jpeg, image/webp, image/jpg"
                className="sr-only"
                id="product-image-upload"
                name="product-image-upload"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, JPEG, atau WebP (Maks. 5MB)
            </p>
          </div>
        </div>

        {file && (
          <Card className="relative mt-4 gap-4 bg-muted/60 p-4 shadow-none rounded-2xl border">
            <Button
              aria-label="Remove"
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={resetFile}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X aria-hidden={true} className="h-4 w-4 shrink-0" />
            </Button>

            <div className="flex items-center space-x-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border">
                <ImageIcon className="h-5 w-5 text-primary" />
              </span>
              <div className="overflow-hidden pr-6">
                <p className="text-pretty font-medium text-foreground text-xs truncate">
                  {file.name}
                </p>
                <p className="mt-0.5 text-pretty text-muted-foreground text-xs">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-3">
              <Progress className="h-1.5" value={progress} />
              <span className="text-muted-foreground text-xs font-medium">{progress}%</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}