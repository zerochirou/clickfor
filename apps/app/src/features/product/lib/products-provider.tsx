"use client";

import { Product } from "@/lib/types/product";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
  const [prevInitialProducts, setPrevInitialProducts] = useState(initialProducts);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    setProducts(initialProducts);
  }

  const value = useMemo(() => ({ products, setProducts }), [products]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider.");
  }
  return context;
}
