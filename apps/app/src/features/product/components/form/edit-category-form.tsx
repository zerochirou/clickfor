"use client";

import { useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { EmojiSelector } from "@/components/commons/emoji-selector";
import { ProductCategory } from "@/lib/types/product";
import {
  UpdateProductCategoryInput,
  updateProductCategorySchema,
} from "../../lib/product-category-schema";
import { updateProductCategory } from "../../api/update-product-category";

// Fallback schema to guard against Turbopack HMR / Fast Refresh evaluation timing
const fallbackSchema = z.object({
  name: z
    .string()
    .min(4, "Nama kategori minimal 4 karakter")
    .max(20, "Nama kategori maksimal 20 karakter"),
  description: z
    .string()
    .max(200, "Deskripsi maksimal 200 karakter")
    .optional(),
  icon: z.string().min(1, "Ikon wajib dipilih"),
});

const schema = updateProductCategorySchema || fallbackSchema;

interface EditCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ProductCategory | null;
  workspaceId: string;
  onSuccess: (updated: ProductCategory) => void;
}

export function EditCategoryForm({
  open,
  onOpenChange,
  category,
  workspaceId,
  onSuccess,
}: EditCategorySheetProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateProductCategoryInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      icon: "🍔",
    },
  });

  // Reset form with category data when sheet opens
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
        icon: category.icon || "🍔",
      });
    }
  }, [category, reset]);

  const onSubmit = (data: UpdateProductCategoryInput) => {
    if (!category) return;

    startTransition(async () => {
      try {
        const updated = await updateProductCategory({
          workspaceId,
          categoryId: category.id,
          data: {
            name: data.name.trim(),
            description: data.description?.trim() || undefined,
            icon: data.icon,
          },
        });

        // Preserve productCount if present
        const merged: ProductCategory = {
          ...updated,
          productCount: category.productCount,
          _count: category._count,
        };

        toast.success(`Kategori "${data.name}" berhasil diperbarui`);
        onSuccess(merged);
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal memperbarui kategori. Silakan coba lagi.",
        );
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="px-4">
          <SheetTitle className="flex items-center gap-2">
            <span>Edit Kategori</span>
            {category && (
              <span className="text-xl" role="img" aria-label="icon">
                {category.icon}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Ubah nama, ikon, atau deskripsi kategori ini.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4">
          <FieldSet>
            <Field>
              <FieldLabel>Nama Kategori</FieldLabel>
              <Input
                type="text"
                placeholder="Contoh: Makanan Utama"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.name.message}
                </p>
              ) : (
                <FieldDescription>
                  Panjang nama antara 4 - 20 karakter.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Pilih Ikon</FieldLabel>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <EmojiSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.icon && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.icon.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Deskripsi Kategori</FieldLabel>
              <Textarea
                rows={3}
                placeholder="Deskripsi kategori..."
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.description.message}
                </p>
              ) : (
                <FieldDescription>Maksimal 200 karakter.</FieldDescription>
              )}
            </Field>
          </FieldSet>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  Menyimpan <Spinner className="ml-2" />
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
