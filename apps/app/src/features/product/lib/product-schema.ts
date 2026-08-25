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
