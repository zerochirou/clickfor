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
import { ArrowLeft, HardDriveUpload } from "lucide-react";

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
import { useEffect } from "react";
import { getDraft } from "../../lib/get-draft";
import { deleteDraft } from "../../lib/delete-draft";
import { useRouter } from "next/navigation";

export function CreateProductForm() {
  const router = useRouter()
  const form = useForm<CreateProductInput, undefined, CreateProductOutput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productName: "",
      description: "",
      isActive: false,
      isUp: false,
      purchasePrice: 0,
      salePrice: 0,
      minStock: 0,
    },
  });

  function onSubmit(values: CreateProductInput) {
    console.log("VALID DATA:", values);
  }

  useEffect(() => {
    const draft = getDraft();
    if (!draft) return;
    try {
      const parsedDraft = JSON.parse(draft);
      form.reset(parsedDraft);
    } catch {
      deleteDraft();
    }
  }, [form]);

  function discard() {
    form.reset();
    deleteDraft();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="px-4 py-8 mx-auto max-w-6xl w-full">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon-lg" onClick={() => router.back()}>
              <ArrowLeft/>
            </Button>

            <h1 className="text-2xl font-semibold">Tambah Produk</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="destructive" onClick={discard}>
              Buang
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => saveDraft(form.getValues())}
            >
              Simpan Draft
            </Button>

            <Button type="submit">
              Publish
              <HardDriveUpload />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-5 gap-4 mt-4">
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
                      <FieldLabel htmlFor="productName">Nama produk</FieldLabel>

                      <Input
                        id="productName"
                        placeholder="Nasi Goreng Versi 1"
                        {...form.register("productName")}
                      />

                      <FieldDescription>
                        Gunakan nama produk yang unik dan mudah diingat.
                      </FieldDescription>

                      <FieldError>
                        {form.formState.errors.productName?.message}
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
                <FileUpload />
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
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
