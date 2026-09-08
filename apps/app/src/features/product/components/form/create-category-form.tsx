"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  CreateProductCategoryInput,
  createProductCategorySchema,
} from "@/features/product/lib/product-category-schema";
import { EmojiSelector } from "@/components/commons/emoji-selector";
import { postProductCategory } from "../../api/post-product-category";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ProductCategory } from "@/lib/types/product";

const fallbackSchema = z.object({
  name: z
    .string()
    .min(4, "Nama kategori minimal 4 karakter")
    .max(20, "Nama kategori maksimal 20 karakter"),
  description: z
    .string()
    .min(4, "Deskripsi minimal 4 karakter")
    .max(200, "Deskripsi maksimal 200 karakter"),
  icon: z.string().min(1, "Ikon wajib dipilih"),
});

const schema = createProductCategorySchema || fallbackSchema;

interface CreateCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onSuccess?: (created: ProductCategory) => void;
}

export function CreateCategoryForm({
  open,
  onOpenChange,
  workspaceId,
  onSuccess,
}: CreateCategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateProductCategoryInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      icon: "🍔",
    },
  });

  const onSubmit = (data: CreateProductCategoryInput) => {
    startTransition(async () => {
      try {
        const created = await postProductCategory({
          data: data,
          workspaceId: workspaceId,
        });
        toast.success("Kategori berhasil dibuat");
        reset();
        onSuccess?.(created);
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal membuat kategori",
        );
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Buat Kategori Baru</SheetTitle>
          <SheetDescription className="">
            Kategori ini digunakan untuk mengelompokan jenis produk.
          </SheetDescription>
        </SheetHeader>

        <Separator className="" />
        <form className="px-4 mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <Field>
              <FieldLabel>Nama Kategori</FieldLabel>
              <Input
                type="text"
                placeholder="Nama Kategori"
                {...register("name")}
              />

              {errors.name ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.name.message}
                </p>
              ) : (
                <FieldDescription>
                  Gunakan huruf kapital untuk setiap kata.
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
              {errors.icon ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.icon.message}
                </p>
              ) : (
                <FieldDescription>
                  Pilih ikon yang mendeskripsikan kategori produk ini.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea
                placeholder="Deskripsi singkat kategori..."
                rows={3}
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {errors.description.message}
                </p>
              ) : (
                <FieldDescription>
                  Beri deskripsi ringkas agar kategori mudah dipahami.
                </FieldDescription>
              )}
            </Field>
          </FieldSet>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                Menyimpan <Spinner className="ml-2" />
              </>
            ) : (
              "Buat Kategori"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
