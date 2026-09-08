export interface CreateProduct {
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  image: string | null;
  isUp: boolean;
}

export interface CreateProductCategory {
  name: string;
  description: string;
  icon: string;
}

export interface CreateProductCategoryBulk {
  categories: CreateProductCategory[];
  skipDuplicates?: boolean;
}
