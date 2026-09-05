import { z } from "zod";

export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama produk wajib diisi")
      .min(3, "Nama produk minimal 3 karakter"),

    description: z
      .string()
      .min(1, "Deskripsi wajib diisi")
      .max(1000, "Deskripsi maksimal 1000 karakter"),

    isActive: z.boolean(),
    isUp: z.boolean(),

    purchasePrice: z.coerce.number().min(0, "COGS tidak boleh negatif"),

    salePrice: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),

    minStock: z.coerce
      .number()
      .int("Minimal stok harus berupa bilangan bulat")
      .min(0, "Minimal stok tidak boleh negatif"),
    stock: z.coerce
      .number()
      .int("Minimal stok harus berupa bilangan bulat")
      .min(0, "Minimal stok tidak boleh negatif"),
    unit: z.string(),
  })
  .refine((data) => data.salePrice > data.purchasePrice, {
    message: "Harga jual harus lebih tinggi dari COGS",
    path: ["salePrice"],
  });

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama produk wajib diisi")
      .min(3, "Nama produk minimal 3 karakter"),

    description: z
      .string()
      .max(1000, "Deskripsi maksimal 1000 karakter")
      .optional()
      .or(z.literal("")),

    isActive: z.boolean().optional(),
    isUp: z.boolean().optional(),

    purchasePrice: z.coerce
      .number()
      .min(0, "COGS tidak boleh negatif")
      .optional(),

    salePrice: z.coerce
      .number()
      .min(0, "Harga jual tidak boleh negatif")
      .optional(),

    minStock: z.coerce
      .number()
      .int("Minimal stok harus berupa bilangan bulat")
      .min(0, "Minimal stok tidak boleh negatif")
      .optional(),

    stock: z.coerce
      .number()
      .int("Stok harus berupa bilangan bulat")
      .min(0, "Stok tidak boleh negatif")
      .optional(),

    unit: z.string().optional(),
    image: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (
        typeof data.salePrice === "number" &&
        typeof data.purchasePrice === "number" &&
        data.salePrice > 0 &&
        data.purchasePrice > 0
      ) {
        return data.salePrice > data.purchasePrice;
      }
      return true;
    },
    {
      message: "Harga jual harus lebih tinggi dari COGS",
      path: ["salePrice"],
    },
  );

export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type UpdateProductOutput = z.output<typeof updateProductSchema>;
