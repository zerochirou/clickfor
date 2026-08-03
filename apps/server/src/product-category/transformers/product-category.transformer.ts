export class ProductCategoryTransformer {
  workspaceId: string;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  icon: string | null;

  constructor(partial: Partial<ProductCategoryTransformer>) {
    Object.assign(this, partial);
  }
}
