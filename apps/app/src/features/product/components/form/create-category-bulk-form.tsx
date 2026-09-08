"use client";

import { useTransition } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { EmojiSelector } from "@/components/commons/emoji-selector";
import createProductCategoryBulkSchema, {
  CreateProductCategoryBulkInput,
  categoryItemSchema,
} from "../../lib/product-category-bulk-schema";
import { postProductCategoryBulk } from "../../api/post-product-category-bulk";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/features/workspace/lib/workspace-provider";

interface CreateCategoryBulkFormProps {
  workspaceId?: string;
}

const fallbackSchema = z.object({
  categories: z
    .array(categoryItemSchema)
    .min(1, "Minimal harus ada 1 kategori"),
});

const schema = createProductCategoryBulkSchema || fallbackSchema;

const DEFAULT_CATEGORY = {
  name: "",
  description: "",
  icon: "🍔",
};

export function CreateCategoryBulkForm({
  workspaceId,
}: CreateCategoryBulkFormProps) {
  const router = useRouter();
  const { workspace } = useWorkspace();
  const targetWorkspaceId = workspaceId || workspace.id;
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProductCategoryBulkInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      categories: [
        { ...DEFAULT_CATEGORY },
        { name: "", description: "", icon: "🥤" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const handleAddCategory = () => {
    append({
      name: "",
      description: "",
      icon: "📦",
    });
  };

  const onSubmit = (data: CreateProductCategoryBulkInput) => {
    startTransition(async () => {
      try {
        await postProductCategoryBulk({
          data: {
            categories: data.categories,
            skipDuplicates: true,
          },
          workspaceId: targetWorkspaceId,
        });

        toast.success(`${data.categories.length} Kategori berhasil dibuat!`);

        router.push(`/workspace/${targetWorkspaceId}/product`);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal menambahkan kategori. Silakan coba lagi.",
        );
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="px-4 py-8 space-y-6 max-w-5xl mx-auto w-full"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
        <div className="flex items-center gap-3">
          <Link href={`/workspace/${targetWorkspaceId}/product`}>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="hover:scale-105 active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">
                Tambah Banyak Kategori
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                {fields.length} item
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tambahkan beberapa kategori sekaligus untuk mengelompokkan produk
              Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link href={`/workspace/${targetWorkspaceId}/product`}>
            <Button variant="ghost" type="button" disabled={isPending}>
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            form="bulk-category-form"
            disabled={isPending}
            className="min-w-36 active:scale-98 transition-transform"
          >
            {isPending ? (
              <>
                Menyimpan <Spinner className="ml-2" />
              </>
            ) : (
              <>
                Simpan Semua ({fields.length})
                <Plus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form Content */}
      <form
        id="bulk-category-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FieldSet className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {fields.map((fieldItem, index) => {
              const itemErrors = errors.categories?.[index];

              return (
                <motion.div
                  key={fieldItem.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: -12,
                    transition: { duration: 0.18, ease: "easeInOut" },
                  }}
                  transition={{
                    duration: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                    layout: { duration: 0.25, ease: "easeOut" },
                  }}
                >
                  <Card className="shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="size-6 p-0 flex items-center justify-center font-mono text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <CardTitle className="text-base font-semibold">
                          Kategori {index + 1}
                        </CardTitle>
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => remove(index)}
                          title="Hapus baris ini"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>

                    <CardContent className="pt-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Field>
                            <FieldLabel>Nama Kategori</FieldLabel>
                            <Input
                              type="text"
                              placeholder="Contoh: Makanan Berat"
                              {...register(`categories.${index}.name` as const)}
                            />
                            {itemErrors?.name ? (
                              <p className="text-[0.8rem] font-medium text-destructive">
                                {itemErrors.name.message}
                              </p>
                            ) : (
                              <FieldDescription>
                                Panjang nama antara 4 - 20 karakter.
                              </FieldDescription>
                            )}
                          </Field>
                        </div>

                        <div>
                          <Field>
                            <FieldLabel>Pilih Ikon</FieldLabel>
                            <Controller
                              name={`categories.${index}.icon` as const}
                              control={control}
                              render={({ field }) => (
                                <EmojiSelector
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                            {itemErrors?.icon && (
                              <p className="text-[0.8rem] font-medium text-destructive">
                                {itemErrors.icon.message}
                              </p>
                            )}
                          </Field>
                        </div>
                      </div>

                      <Field>
                        <FieldLabel>Deskripsi Kategori</FieldLabel>
                        <Textarea
                          rows={2}
                          placeholder="Deskripsi singkat kategori..."
                          {...register(
                            `categories.${index}.description` as const,
                          )}
                        />
                        {itemErrors?.description ? (
                          <p className="text-[0.8rem] font-medium text-destructive">
                            {itemErrors.description.message}
                          </p>
                        ) : (
                          <FieldDescription>
                            Maksimal 200 karakter.
                          </FieldDescription>
                        )}
                      </Field>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Row Button with smooth layout transition */}
          <motion.div layout transition={{ duration: 0.2, ease: "easeOut" }}>
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-sm font-medium border-dashed hover:border-primary/60 hover:bg-primary/5 transition-all group"
              onClick={handleAddCategory}
            >
              <Plus className="mr-2 h-4 w-4 text-primary group-hover:scale-125 transition-transform" />
              Tambah Baris Kategori
            </Button>
          </motion.div>
        </FieldSet>

        {/* Bottom Actions Bar */}
        <motion.div
          layout
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between pt-4 border-t"
        >
          <Link href={`/workspace/${targetWorkspaceId}/product`}>
            <Button variant="ghost" type="button" disabled={isPending}>
              Batal
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isPending}
            className="min-w-36 active:scale-98 transition-transform"
          >
            {isPending ? (
              <>
                Menyimpan <Spinner className="ml-2" />
              </>
            ) : (
              <>
                Simpan Semua ({fields.length})
                <Plus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
