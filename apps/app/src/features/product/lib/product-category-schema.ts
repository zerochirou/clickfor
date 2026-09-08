import { z } from "zod";

export const createProductCategorySchema = z.object({
  name: z.string().min(4, "Nama kategori minimal 4 karakter").max(20, "Nama kategori maksimal 20 karakter"),
  description: z.string().min(4, "Deskripsi minimal 4 karakter").max(200, "Deskripsi maksimal 200 karakter"),
  icon: z.string().min(1, "Ikon wajib dipilih"),
});

export type CreateProductCategoryInput = z.input<
  typeof createProductCategorySchema
>;

export type CreateProductCategoryOutput = z.output<
  typeof createProductCategorySchema
>;

export {
  categoryItemSchema,
  createProductCategoryBulkSchema,
  type CategoryItemInput,
  type CategoryItemOutput,
  type CreateProductCategoryBulkInput,
  type CreateProductCategoryBulkOutput,
} from "./product-category-bulk-schema";
