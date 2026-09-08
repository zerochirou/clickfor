"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, HardDriveUpload, Plus } from "lucide-react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldSeparator,
} from "@/components/ui/field";

import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/commons/upload-file/drag-and-drop";

import {
  CreateProductInput,
  CreateProductOutput,
  createProductSchema,
} from "../../lib/product-schema";
import { saveDraft } from "../../lib/save-draft";
import { useEffect, useState, useTransition } from "react";
import { getDraft } from "../../lib/get-draft";
import { deleteDraft } from "../../lib/delete-draft";
import { useRouter } from "next/navigation";
import { getPresignedUploadURL } from "../../api/get-presigned-upload-url";
import { useWorkspace } from "@/features/workspace/lib/workspace-provider";
import { CreateCategoryForm } from "./create-category-form";
import { getProductCategory } from "../../api/get-product-category";
import { ProductCategory } from "@/lib/types/product";
import { ProductCategorySelector } from "./product-category-selector";
import { postProduct } from "../../api/post-product";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function CreateProductForm() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [productCategory, setProductCategory] = useState<ProductCategory[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<CreateProductInput, undefined, CreateProductOutput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: false,
      isUp: false,
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      unit: "pcs",
      minStock: 0,
    },
  });

  async function onSubmit(values: CreateProductInput) {
    try {
      if (!categoryId) {
        toast.error("Silakan pilih kategori produk terlebih dahulu");
        return;
      }

      let fileKey = null;

      // TAHAP 1 & 2: Jika user memilih file, minta URL lalu upload langsung ke storage
      if (selectedFile) {
        const fileName = encodeURIComponent(selectedFile.name);
        const contentType = encodeURIComponent(selectedFile.type);
        const presignedData = await getPresignedUploadURL({
          workspaceId: workspace.id,
          fileName: fileName,
          contentType: contentType,
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

      // TAHAP 3: Kirim data produk lengkap beserta `fileKey` ke Backend
      const finalPayload = {
        ...values,
        image: fileKey,
      };

      startTransition(async () => {
        try {
          await postProduct({
            data: {
              name: finalPayload.name,
              description: finalPayload.description,
              purchasePrice: Number(finalPayload.purchasePrice),
              salePrice: Number(finalPayload.salePrice),
              stock: Number(finalPayload.stock),
              minStock: Number(finalPayload.minStock),
              unit: finalPayload.unit,
              isActive: finalPayload.isActive,
              isUp: finalPayload.isUp,
              image: finalPayload.image,
            },
            workspaceId: workspace.id,
            categoryId: categoryId,
          });
          toast.success("Produk berhasil dibuat!");
          deleteDraft(workspace.id);
          router.back();
          router.refresh();
        } catch (error) {
          console.error("Error saat submit produk:", error);
          toast.error(
            error instanceof Error ? error.message : "Gagal membuat produk.",
          );
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saat submit produk:", error);
        toast.error(error.message || "Terjadi kesalahan.");
      }
    }
  }

  async function handleGetProductCategory() {
    const categories = await getProductCategory({ workspaceId: workspace.id });
    setProductCategory(categories);
  }

  useEffect(() => {
    const draft = getDraft(workspace.id);
    if (!draft) return;
    try {
      const parsedDraft = JSON.parse(draft);
      form.reset(parsedDraft);
    } catch {
      deleteDraft(workspace.id);
    }
  }, [form, workspace.id]);

  function discard() {
    form.reset();
    deleteDraft(workspace.id);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-4 py-8 mx-auto max-w-6xl w-full">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={() => router.back()}
              >
                <ArrowLeft />
              </Button>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Tambah Produk
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tambahkan produk Anda.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="destructive" onClick={discard}>
                Buang
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => saveDraft(form.getValues(), workspace.id)}
              >
                Simpan Draft
              </Button>

              <Button type="submit">
                {isPending ? (
                  <>
                    Loading <Spinner />
                  </>
                ) : (
                  <>
                    {" "}
                    Publish
                    <HardDriveUpload />
                  </>
                )}
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-5 gap-4 mt-14">
            {/* LEFT */}
            <div className="col-span-3 flex flex-col gap-4">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Detail Produk</CardTitle>

                  <CardDescription>
                    Bagian ini akan menampilkan informasi umum produk
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FieldSet>
                    <FieldGroup>
                      {/* PRODUCT NAME */}
                      <Field>
                        <FieldLabel htmlFor="productName">
                          Nama produk
                        </FieldLabel>

                        <Input
                          id="productName"
                          placeholder="Nasi Goreng Versi 1"
                          {...form.register("name")}
                        />

                        <FieldDescription>
                          Gunakan nama produk yang unik dan mudah diingat.
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
                          {...form.register("description")}
                        />

                        <FieldDescription>
                          Deskripsi yang singkat dan jelas dapat membantu
                          menjelaskan produk Anda.
                        </FieldDescription>

                        <FieldError>
                          {form.formState.errors.description?.message}
                        </FieldError>
                      </Field>

                      <div className="flex items-center gap-2">
                        <Field>
                          <FieldLabel>Kategori produk</FieldLabel>
                          <ProductCategorySelector
                            productCategory={productCategory}
                            value={categoryId}
                            onSelect={(selectedId) => setCategoryId(selectedId)}
                            onOpen={handleGetProductCategory}
                          />
                          <FieldDescription>
                            Masukan kategori produk yang sesuai.
                          </FieldDescription>
                        </Field>
                        <Button
                          type="button"
                          onClick={() => setIsCategoryFormOpen(true)}
                        >
                          Buat Kategori <Plus />
                        </Button>
                      </div>

                      <FieldSeparator />

                      {/* ACTIVE */}
                      <Field orientation="horizontal">
                        <Switch
                          id="isActive"
                          // eslint-disable-next-line react-hooks/incompatible-library
                          checked={form.watch("isActive")}
                          onCheckedChange={(value) =>
                            form.setValue("isActive", value, {
                              shouldValidate: true,
                            })
                          }
                        />

                        <FieldLabel htmlFor="isActive">
                          Apakah produk ini tersedia untuk dirilis?
                        </FieldLabel>
                      </Field>

                      {/* OPTIMIZATION */}
                      <Field orientation="horizontal">
                        <Switch
                          id="isUp"
                          checked={form.watch("isUp")}
                          onCheckedChange={(value) =>
                            form.setValue("isUp", value, {
                              shouldValidate: true,
                            })
                          }
                        />

                        <FieldLabel htmlFor="isUp">
                          Optimalkan Produk ini?
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>

              {/* IMAGE */}
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Gambar Produk</CardTitle>

                  <CardDescription>
                    Bagian ini akan menampilkan gambar produk
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FileUpload onFileSelect={(file) => setSelectedFile(file)} />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="col-span-2">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Harga</CardTitle>

                  <CardDescription>
                    Bagian ini akan menampilkan harga produk
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FieldSet>
                    <FieldGroup>
                      {/* COGS */}
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
                                  numericOnly ? Number(numericOnly) : undefined,
                                );
                              }}
                            />
                          )}
                        />
                        <FieldDescription>
                          Biaya pembuatan atau modal per produk.
                        </FieldDescription>

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
                                  numericOnly ? Number(numericOnly) : undefined,
                                );
                              }}
                            />
                          )}
                        />

                        <FieldDescription>
                          Harga jual per produk. Pastikan harga ini lebih tinggi
                          dari harga modal.
                        </FieldDescription>

                        <FieldError>
                          {form.formState.errors.salePrice?.message}
                        </FieldError>
                      </Field>

                      {/* MIN STOCK */}
                      <Field>
                        <FieldLabel htmlFor="minStock">Minimal Stok</FieldLabel>

                        <Input
                          id="minStock"
                          type="number"
                          min="0"
                          step="1"
                          {...form.register("minStock")}
                        />

                        <FieldDescription>
                          Minimal stok yang harus tersedia untuk produk ini.
                        </FieldDescription>

                        <FieldError>
                          {form.formState.errors.minStock?.message}
                        </FieldError>
                      </Field>

                      {/* STOCK */}
                      <Field>
                        <FieldLabel htmlFor="stock">Stok Produk</FieldLabel>

                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          step="1"
                          {...form.register("stock")}
                        />

                        <FieldDescription>
                          Stok yang harus tersedia untuk produk ini.
                        </FieldDescription>

                        <FieldError>
                          {form.formState.errors.stock?.message}
                        </FieldError>
                      </Field>

                      {/* UNIT */}
                      <Field>
                        <FieldLabel htmlFor="unit">Unit</FieldLabel>

                        <Input
                          id="unit"
                          type="text"
                          {...form.register("unit")}
                        />

                        <FieldDescription>Unit produk ini.</FieldDescription>

                        <FieldError>
                          {form.formState.errors.unit?.message}
                        </FieldError>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
      <CreateCategoryForm
        open={isCategoryFormOpen}
        onOpenChange={setIsCategoryFormOpen}
        workspaceId={workspace.id}
      />
    </>
  );
}
