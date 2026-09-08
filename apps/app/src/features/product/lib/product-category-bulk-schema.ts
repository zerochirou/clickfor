import { z } from "zod";

export const categoryItemSchema = z.object({
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

export const createProductCategoryBulkSchema = z.object({
  categories: z
    .array(categoryItemSchema)
    .min(1, "Minimal harus ada 1 kategori"),
});

export type CategoryItemInput = z.input<typeof categoryItemSchema>;
export type CategoryItemOutput = z.output<typeof categoryItemSchema>;

export type CreateProductCategoryBulkInput = z.input<
  typeof createProductCategoryBulkSchema
>;
export type CreateProductCategoryBulkOutput = z.output<
  typeof createProductCategoryBulkSchema
>;

export default createProductCategoryBulkSchema;
