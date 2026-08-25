"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface CreateCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function CreateCategoryForm({
  open,
  onOpenChange,
  workspaceId,
}: CreateCategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProductCategoryInput>({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "🍔",
    },
  });

  // 2. Fungsi Submit Form
  const onSubmit = (data: CreateProductCategoryInput) => {
    startTransition(async () => {
      await postProductCategory(data, workspaceId);
      toast.success("Kategori berhasil dibuat");
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
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
        <form className="px-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
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
              <FieldLabel>Deskripsi Kategori</FieldLabel>
              <Textarea
                placeholder="Deskripsi Kategori"
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

            <Field className="pt-4">
              <Button type="submit">
                {isPending ? (
                  <>
                    Loading <Spinner />
                  </>
                ) : (
                  <>
                    Buat Kategori <Plus className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </Field>
          </FieldSet>
        </form>
      </SheetContent>
    </Sheet>
  );
}
