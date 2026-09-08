"use client";

import { useState, useTransition, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  Check,
  HardDriveUpload,
  Image as ImageIcon,
  RotateCcw,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldSeparator,
} from "@/components/ui/field";
import FileUpload from "@/components/commons/upload-file/drag-and-drop";

import { Product } from "@/lib/types/product";
import {
  UpdateProductInput,
  updateProductSchema,
} from "../../lib/product-schema";
import { updateProduct } from "../../api/update-product";
import { getPresignedUploadURL } from "../../api/get-presigned-upload-url";
import { CategoryTooltip } from "../table/category-tooltip";

interface UpdateProductFormProps {
  product: Product;
  workspaceId: string;
}

export function UpdateProductForm({
  product,
  workspaceId,
}: UpdateProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      isActive: Boolean(product.isActive),
      isUp: Boolean(product.isUp),
      purchasePrice: Number(product.purchasePrice) || 0,
      salePrice: Number(product.salePrice) || 0,
      stock: product.stock ?? 0,
      minStock: product.minStock ?? 0,
      unit: product.unit ?? "pcs",
      image: product.image ?? null,
    },
  });

  const watchedPurchasePrice =
    Number(useWatch({ control: form.control, name: "purchasePrice" })) || 0;
  const watchedSalePrice =
    Number(useWatch({ control: form.control, name: "salePrice" })) || 0;
  const watchedStock =
    Number(useWatch({ control: form.control, name: "stock" })) || 0;
  const watchedMinStock =
    Number(useWatch({ control: form.control, name: "minStock" })) || 0;
  const watchedName = useWatch({ control: form.control, name: "name" });
  const watchedIsUp = useWatch({ control: form.control, name: "isUp" });
  const watchedIsActive = useWatch({ control: form.control, name: "isActive" });
  const watchedUnit = useWatch({ control: form.control, name: "unit" });

  // Calculate live profit & margin
  const profit = watchedSalePrice - watchedPurchasePrice;
  const marginPercentage =
    watchedSalePrice > 0 ? Math.round((profit / watchedSalePrice) * 100) : 0;

  async function onSubmit(values: UpdateProductInput) {
    try {
      let fileKey = product.image;

      // Handle new image upload if selected
      if (selectedFile) {
        const fileName = encodeURIComponent(selectedFile.name);
        const contentType = encodeURIComponent(selectedFile.type);
        const presignedData = await getPresignedUploadURL({
          workspaceId,
          fileName,
          contentType,
        });

        if (presignedData?.uploadURL) {
          const uploadRes = await fetch(presignedData.uploadURL, {
            method: "PUT",
            body: selectedFile,
            headers: {
              "Content-Type": selectedFile.type,
            },
          });

          if (!uploadRes.ok) {
            throw new Error("Gagal mengunggah file gambar ke storage.");
          }

          fileKey = presignedData.fileKey;
        }
      }

      startTransition(async () => {
        try {
          await updateProduct({
            workspaceId,
            productId: product.id,
            data: {
              name: values.name,
              description: values.description,
              purchasePrice: Number(values.purchasePrice),
              salePrice: Number(values.salePrice),
              stock: Number(values.stock),
              minStock: Number(values.minStock),
              unit: values.unit,
              isActive: values.isActive,
              isUp: values.isUp,
              image: fileKey,
            },
          });

          toast.success("Produk berhasil diperbarui!");
          form.reset(values);
          setSelectedFile(null);
          setIsChangingImage(false);
          router.refresh();
        } catch (error) {
          console.error("Error updating product:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memperbarui produk.",
          );
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error submit update:", error);
        toast.error(error.message || "Terjadi kesalahan.");
      }
    }
  }

  function handleReset() {
    form.reset({
      name: product.name,
      description: product.description ?? "",
      isActive: Boolean(product.isActive),
      isUp: Boolean(product.isUp),
      purchasePrice: Number(product.purchasePrice) || 0,
      salePrice: Number(product.salePrice) || 0,
      stock: product.stock ?? 0,
      minStock: product.minStock ?? 0,
      unit: product.unit ?? "pcs",
      image: product.image ?? null,
    });
    setSelectedFile(null);
    setIsChangingImage(false);
    toast.info("Form dikembalikan ke data awal.");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="px-4 py-4 mx-auto max-w-6xl w-full space-y-4">
        {/* Notion-style Cover Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Notion Header Cover Banner */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-3xl overflow-hidden border bg-muted/60 shadow-xs group">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview Cover"
                fill
                unoptimized
                className="object-cover"
              />
            ) : product.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_S3_PRODUCT_BUCKET}/${product.image}`}
                alt={product.name}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="size-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-linear-to-b from-muted/40 to-muted">
                <ImageIcon className="size-12 stroke-1 opacity-50" />
                <span className="text-xs">Belum ada gambar sampul produk</span>
              </div>
            )}

            {/* Subtle aesthetic gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background/20 via-background/20 to-black/20 pointer-events-none" />

            {/* Floating Top-Left Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full bg-background/80 hover:bg-background backdrop-blur-md shadow-xs transition-transform active:scale-95"
                aria-label="Kembali"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </div>

            {/* Floating Cover Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {previewUrl && (
                <Badge className="bg-primary/90 text-primary-foreground text-xs shadow-xs backdrop-blur-md">
                  Pratinjau Sampul Baru
                </Badge>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsChangingImage(!isChangingImage);
                  if (!isChangingImage) {
                    setTimeout(() => {
                      uploadSectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 100);
                  }
                }}
                className="bg-background/85 hover:bg-background backdrop-blur-md shadow-xs text-xs gap-1.5 transition-all"
              >
                <Camera className="size-3.5" />
                <span>
                  {isChangingImage ? "Tutup Pengunggah" : "Ganti Sampul"}
                </span>
              </Button>
            </div>
          </div>

          {/* Title, Category Icon & Action Buttons Row (Notion-style overlap) */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-2 pt-1">
            <div className="flex items-start sm:items-center gap-4">
              {/* Overlapping Notion Page Icon */}
              {/*<div className="size-16 sm:size-20 rounded-2xl border-4 bg-card border-card flex items-center justify-center text-3xl shrink-0 -mt-8 sm:-mt-10 relative z-10 select-none ring-1 ring-border/20">
              </div>*/}
              <Card className="p-2">
                <CardContent className="text-4xl p-2">
                  {product.category?.icon || "📦"}
                </CardContent>
              </Card>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {watchedName || product.name}
                  </h1>
                  <Badge variant="outline" className="font-mono text-xs">
                    {product.sku}
                  </Badge>
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">
                      {product.category.name}
                    </Badge>
                  )}
                  {watchedIsUp && (
                    <Badge variant="default" className="text-xs gap-1">
                      Dioptimalkan <Zap className="size-3 fill-current" />
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Kelola informasi produk, stok inventaris, harga jual, dan
                  ketersediaan
                </p>
              </div>
            </div>

            {/* Form Save & Reset Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <AnimatePresence>
                {form.formState.isDirty && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex items-center gap-1.5"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="size-3 mr-1" /> Reset
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending}
                className="relative overflow-hidden shadow-sm"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="size-4" /> Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HardDriveUpload className="size-4" /> Simpan Perubahan
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Cover File Uploader Banner (opens when clicking Ganti Sampul) */}
        <AnimatePresence>
          {isChangingImage && (
            <motion.div
              ref={uploadSectionRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="rounded-3xl border-dashed border-2 bg-muted/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Unggah Gambar Sampul Baru
                      </CardTitle>
                      <CardDescription>
                        Format yang didukung: JPG, PNG, WEBP. Gambar akan
                        langsung tampil di banner atas.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChangingImage(false)}
                      className="text-xs"
                    >
                      Batal
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <FileUpload
                    onFileSelect={(file) => {
                      if (file) {
                        setSelectedFile(file);
                        form.setValue("image", file.name, {
                          shouldDirty: true,
                        });
                      } else {
                        setSelectedFile(null);
                      }
                    }}
                  />
                  {selectedFile && (
                    <div className="flex items-center justify-between p-3 rounded-2xl border bg-primary/5 text-xs">
                      <span className="flex items-center gap-2 font-medium">
                        <Upload className="size-4 text-primary" />
                        Sampul terpilih: {selectedFile.name} (
                        {(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedFile(null)}
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* LEFT COLUMN: DETAIL & DESKRIPSI (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Detail Produk */}
            <Card className="rounded-3xl shadow-xs h-full">
              <CardHeader>
                <CardTitle className="text-lg">Detail Produk</CardTitle>
                <CardDescription>
                  Informasi umum dan deskripsi produk Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    {/* PRODUCT NAME */}
                    <Field>
                      <FieldLabel htmlFor="name">Nama produk</FieldLabel>
                      <Input
                        id="name"
                        placeholder="Contoh: Sepatu Sneakers Pro"
                        {...form.register("name")}
                      />
                      <FieldDescription>
                        Nama produk unik yang akan tampil di katalog.
                      </FieldDescription>
                      <FieldError>
                        {form.formState.errors.name?.message}
                      </FieldError>
                    </Field>

                    {/* DESCRIPTION */}
                    <Field>
                      <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder="Jelaskan detail, bahan, atau kegunaan produk..."
                        {...form.register("description")}
                      />
                      <FieldDescription>
                        Deskripsi singkat yang jelas dan menarik.
                      </FieldDescription>
                      <FieldError>
                        {form.formState.errors.description?.message}
                      </FieldError>
                    </Field>

                    {/* CATEGORY INFO */}
                    <div className="space-y-1.5 pt-1">
                      <FieldLabel>Kategori Produk</FieldLabel>
                      <div className="flex items-center gap-2">
                        {product.category ? (
                          <CategoryTooltip
                            name={product.category.name}
                            description={product.category.description}
                            icon={product.category.icon}
                          />
                        ) : (
                          <Badge variant="outline">Tanpa Kategori</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          (Kategori ditentukan saat pembuatan)
                        </span>
                      </div>
                    </div>

                    <FieldSeparator />

                    {/* ACTIVE SWITCH */}
                    <Field orientation="horizontal">
                      <Switch
                        id="isActive"
                        checked={Boolean(watchedIsActive)}
                        onCheckedChange={(value) =>
                          form.setValue("isActive", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                      />
                      <div className="space-y-0.5">
                        <FieldLabel
                          htmlFor="isActive"
                          className="cursor-pointer"
                        >
                          Tersedia untuk dirilis
                        </FieldLabel>
                        <p className="text-xs text-muted-foreground">
                          Aktifkan agar produk dapat dilihat oleh pelanggan.
                        </p>
                      </div>
                    </Field>

                    {/* OPTIMIZATION SWITCH */}
                    <Field orientation="horizontal">
                      <Switch
                        id="isUp"
                        checked={Boolean(watchedIsUp)}
                        onCheckedChange={(value) =>
                          form.setValue("isUp", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                      />
                      <div className="space-y-0.5">
                        <FieldLabel
                          htmlFor="isUp"
                          className="cursor-pointer flex items-center gap-1.5"
                        >
                          Optimalkan Produk{" "}
                          <Zap className="size-3.5 text-primary fill-current" />
                        </FieldLabel>
                        <p className="text-xs text-muted-foreground">
                          Tampilkan produk di barisan rekomendasi teratas.
                        </p>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT COLUMN: HARGA & INVENTARIS (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Harga & Margin Card */}
            <Card className="rounded-3xl shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Harga & Keuntungan</CardTitle>
                <CardDescription>
                  Atur harga modal dan tentukan harga jual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldSet>
                  <FieldGroup>
                    {/* COGS / Modal */}
                    <Field>
                      <FieldLabel htmlFor="purchasePrice">
                        COGS (Modal per produk)
                      </FieldLabel>
                      <Controller
                        name="purchasePrice"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="purchasePrice"
                            type="text"
                            placeholder="0"
                            value={
                              typeof field.value === "number"
                                ? new Intl.NumberFormat("id-ID").format(
                                    field.value,
                                  )
                                : ""
                            }
                            onChange={(e) => {
                              const numericOnly = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              field.onChange(
                                numericOnly ? Number(numericOnly) : 0,
                              );
                            }}
                          />
                        )}
                      />
                      <FieldError>
                        {form.formState.errors.purchasePrice?.message}
                      </FieldError>
                    </Field>

                    {/* SALE PRICE */}
                    <Field>
                      <FieldLabel htmlFor="salePrice">Harga Jual</FieldLabel>
                      <Controller
                        name="salePrice"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="salePrice"
                            type="text"
                            placeholder="0"
                            value={
                              typeof field.value === "number"
                                ? new Intl.NumberFormat("id-ID").format(
                                    field.value,
                                  )
                                : ""
                            }
                            onChange={(e) => {
                              const numericOnly = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              field.onChange(
                                numericOnly ? Number(numericOnly) : 0,
                              );
                            }}
                          />
                        )}
                      />
                      <FieldError>
                        {form.formState.errors.salePrice?.message}
                      </FieldError>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                {/* Dynamic Profit & Margin Box */}
                <div className="p-3.5 rounded-2xl border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="size-3.5" /> Estimasi Profit
                    </span>
                    <Badge
                      variant={profit > 0 ? "secondary" : "destructive"}
                      className="h-5 text-[11px] font-medium"
                    >
                      {marginPercentage > 0
                        ? `+${marginPercentage}%`
                        : `${marginPercentage}%`}{" "}
                      Margin
                    </Badge>
                  </div>
                  <div className="text-lg font-bold">
                    Rp {Math.max(0, profit).toLocaleString("id-ID")}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      / {watchedUnit || "unit"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventaris & Stok Card */}
            <Card className="rounded-3xl shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Inventaris</CardTitle>
                  <CardDescription>
                    Kelola ketersediaan kuantitas produk
                  </CardDescription>
                </div>
                {/* Dynamic Stock Health Badge */}
                {watchedStock === 0 ? (
                  <Badge variant="destructive" className="h-6">
                    Habis
                  </Badge>
                ) : watchedStock <= watchedMinStock ? (
                  <Badge
                    variant="secondary"
                    className="h-6 text-amber-600 bg-amber-500/10"
                  >
                    Menipis
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="h-6">
                    <Check className="size-3 mr-1" /> Aman
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      {/* MIN STOCK */}
                      <Field>
                        <FieldLabel htmlFor="minStock">
                          Batas Minimum
                        </FieldLabel>
                        <Input
                          id="minStock"
                          type="number"
                          min="0"
                          step="1"
                          {...form.register("minStock")}
                        />
                        <FieldError>
                          {form.formState.errors.minStock?.message}
                        </FieldError>
                      </Field>

                      {/* STOCK */}
                      <Field>
                        <FieldLabel htmlFor="stock">Stok Saat Ini</FieldLabel>
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          step="1"
                          {...form.register("stock")}
                        />
                        <FieldError>
                          {form.formState.errors.stock?.message}
                        </FieldError>
                      </Field>
                    </div>

                    {/* UNIT */}
                    <Field>
                      <FieldLabel htmlFor="unit">Satuan (Unit)</FieldLabel>
                      <Input
                        id="unit"
                        placeholder="Contoh: pcs, box, porsi, kg"
                        {...form.register("unit")}
                      />
                      <FieldError>
                        {form.formState.errors.unit?.message}
                      </FieldError>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </form>
  );
}
