"use client";

import { Product } from "@/lib/types/product";
import { createContext, useContext, useState, ReactNode } from "react";

interface ProductsContextType {
  products: Product[];
  setProducts: (Product: Product[]) => void;
}

const ProductContext = createContext<ProductsContextType | undefined>(
  undefined,
);

interface ProductsProviderProps {
  children: ReactNode;
  initialProducts: Product[];
}

export function ProductsProvider({
  children,
  initialProducts,
}: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return (
    <ProductContext.Provider
      value={{ products, setProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider.");
  }
  return context;
}
