export class ProductCategoryTransformer {
  workspaceId: string;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  icon: string | null;
  _count?: {
    products: number;
  };
  productCount?: number;

  constructor(
    partial: Partial<ProductCategoryTransformer> & {
      _count?: { products: number };
    },
  ) {
    Object.assign(this, partial);
    if (partial._count?.products !== undefined) {
      this.productCount = partial._count.products;
    }
  }
}
