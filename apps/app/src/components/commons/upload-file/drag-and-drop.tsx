'use client';

import {
  Check,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
}

const VALID_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function FileUpload({
  onFileSelect,
}: FileUploadProps) {
  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
  });

  const [clipboardHasImage, setClipboardHasImage] =
    useState(false);

  const [checkingClipboard, setCheckingClipboard] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const intervalRef =
    useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear progress interval
   */
  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB',
    ];

    const i = Math.floor(
      Math.log(bytes) / Math.log(k),
    );

    return (
      Number.parseFloat(
        (bytes / k ** i).toFixed(1),
      ) +
      ' ' +
      sizes[i]
    );
  };

  /**
   * Check apakah clipboard mengandung gambar
   */
  const checkClipboard = async () => {
    if (
      !navigator.clipboard ||
      !navigator.clipboard.read
    ) {
      setClipboardHasImage(false);
      return;
    }

    try {
      setCheckingClipboard(true);

      const clipboardItems =
        await navigator.clipboard.read();

      const hasImage = clipboardItems.some(
        (item) =>
          item.types.some((type) =>
            type.startsWith('image/'),
          ),
      );

      setClipboardHasImage(hasImage);
    } catch {
      /**
       * Browser bisa menolak akses clipboard
       * jika tidak ada permission/user gesture.
       */
      setClipboardHasImage(false);
    } finally {
      setCheckingClipboard(false);
    }
  };

  /**
   * Handle file
   */
  const handleFile = (file: File | undefined) => {
    if (!file) return;

    /**
     * Validate type
     */
    if (!VALID_FILE_TYPES.includes(file.type)) {
      toast.error(
        'Format file tidak didukung. Harap unggah gambar PNG, JPG, JPEG, atau WebP.',
        {
          position: 'bottom-right',
          duration: 3000,
        },
      );

      return;
    }

    /**
     * Validate size
     */
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        'Ukuran gambar terlalu besar. Maksimal 5MB.',
        {
          position: 'bottom-right',
          duration: 3000,
        },
      );

      return;
    }

    clearProgressInterval();

    setUploadState({
      file,
      progress: 0,
      uploading: true,
    });

    /**
     * Karena gambar sudah digunakan,
     * clipboard indicator tidak diperlukan lagi.
     */
    setClipboardHasImage(false);

    onFileSelect?.(file);

    /**
     * Simulasi progress
     */
    intervalRef.current = setInterval(() => {
      setUploadState((prev) => {
        const newProgress =
          prev.progress + 10;

        if (newProgress >= 100) {
          clearProgressInterval();

          return {
            ...prev,
            progress: 100,
            uploading: false,
          };
        }

        return {
          ...prev,
          progress: newProgress,
          uploading: true,
        };
      });
    }, 150);
  };

  /**
   * File picker
   */
  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    handleFile(
      event.target.files?.[0],
    );
  };

  /**
   * Drag & Drop
   */
  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    handleFile(
      event.dataTransfer.files?.[0],
    );
  };

  /**
   * Paste
   */
  const handlePaste = (
    event: ClipboardEvent<HTMLDivElement>,
  ) => {
    const items =
      event.clipboardData?.items;

    if (!items) return;

    for (const item of items) {
      if (
        !item.type.startsWith('image/')
      ) {
        continue;
      }

      const file = item.getAsFile();

      if (file) {
        event.preventDefault();
        handleFile(file);
      }

      return;
    }
  };

  /**
   * Reset file
   */
  const resetFile = () => {
    clearProgressInterval();

    setUploadState({
      file: null,
      progress: 0,
      uploading: false,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onFileSelect?.(null);

    /**
     * Cek lagi clipboard setelah reset.
     */
    checkClipboard();
  };

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      clearProgressInterval();
    };
  }, []);

  const {
    file,
    progress,
    uploading,
  } = uploadState;

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className="
          relative
          mt-2
          flex
          cursor-pointer
          justify-center
          rounded-2xl
          border
          border-dashed
          border-input
          px-6
          py-8
          outline-none
          transition-all
          hover:bg-muted/50
          focus-visible:ring-2
          focus-visible:ring-ring
        "
        tabIndex={0}
        onClick={() => {
          fileInputRef.current?.click();
          checkClipboard();
        }}
        onFocus={checkClipboard}
        onMouseEnter={checkClipboard}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        {/* Clipboard Badge */}
        {clipboardHasImage && !file && (
          <Badge
            variant="secondary"
            className="
              absolute
              right-3
              top-3
              gap-1.5
              border
              bg-background
              shadow-sm
            "
          >
            <Check className="h-3 w-3" />

            Gambar tersedia

            <kbd
              className="
                rounded
                border
                bg-muted
                px-1.5
                py-0.5
                font-mono
                text-[10px]
              "
            >
              ⌘V
            </kbd>
          </Badge>
        )}

        <div className="text-center">
          <ImageIcon
            aria-hidden
            className="mx-auto h-10 w-10 text-muted-foreground"
          />

          <div className="mt-4 flex justify-center text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-primary hover:underline">
              Klik untuk unggah
            </span>

            <p className="pl-1">
              atau seret dan lepas di sini
            </p>

            <input
              ref={fileInputRef}
              id="product-image-upload"
              name="product-image-upload"
              type="file"
              className="sr-only"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileChange}
            />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, JPEG, atau WebP (Maks. 5MB)
          </p>

          {/* Clipboard hint */}
          {!file && (
            <div className="mt-3">
              {checkingClipboard ? (
                <p className="text-xs text-muted-foreground">
                  Memeriksa clipboard...
                </p>
              ) : clipboardHasImage ? (
                <p className="text-xs font-medium text-primary">
                  Tekan{' '}
                  <kbd
                    className="
                      rounded
                      border
                      bg-muted
                      px-1.5
                      py-0.5
                      font-mono
                      text-[10px]
                    "
                  >
                    ⌘V
                  </kbd>{' '}
                  untuk menggunakan gambar
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Kamu juga bisa copy gambar lalu paste di sini
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected File */}
      {file && (
        <Card className="relative mt-4 gap-4 rounded-2xl border bg-muted/60 p-4 shadow-none">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus gambar"
            className="
              absolute
              right-2
              top-2
              text-muted-foreground
              hover:text-foreground
            "
            onClick={resetFile}
          >
            <X
              aria-hidden
              className="h-4 w-4 shrink-0"
            />
          </Button>

          <div className="flex items-center space-x-3">
            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-background
                shadow-sm
                ring-1
                ring-border
              "
            >
              <ImageIcon
                className="h-5 w-5 text-primary"
              />
            </span>

            <div className="overflow-hidden pr-6">
              <p className="truncate text-xs font-medium text-foreground">
                {file.name}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-3">
            <Progress
              className="h-1.5"
              value={progress}
            />

            <span className="text-xs font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}