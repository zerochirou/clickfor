export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  image: string;
  isUp: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
    icon: string;
    description: string;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  productCount?: number;
}
