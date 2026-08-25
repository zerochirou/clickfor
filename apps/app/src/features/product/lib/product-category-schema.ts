import { z } from "zod";

export const createProductCategorySchema = z.object({
  name: z.string().min(4).max(20),
  description: z.string().min(4).max(200),
  icon: z.string(),
});

export type CreateProductCategoryInput = z.input<
  typeof createProductCategorySchema
>;

export type CreateProductCategoryOutput = z.output<
  typeof createProductCategorySchema
>;
