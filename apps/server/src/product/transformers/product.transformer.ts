import { Decimal } from '@prisma/client/runtime/client';

export class ProductTransformer {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  barcode: string;
  purchasePrice: Decimal | null;
  salePrice: Decimal | null;
  stock: number | null;
  minStock: number | null;
  unit: string | null;
  isActive: boolean | null;
  image: string | null;
  isUp: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  workspaceId: string;

  constructor(partial: Partial<ProductTransformer>) {
    Object.assign(this, partial);
  }
}
