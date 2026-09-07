"use client";

import { Product } from "@/lib/types/product";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useRef,
} from "react";

import { PaginationMeta } from "../api/get-product";

interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  initialProducts: Product[];
  meta: PaginationMeta | null;
  setMeta: React.Dispatch<React.SetStateAction<PaginationMeta | null>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  resetSearch: () => void;
  updateProductOptimistic: (
    productId: string,
    updates: Partial<Product>,
  ) => void;
  removeProductOptimistic: (productId: string) => void;
  updatedProductId: string | null;
  setUpdatedProductId: (id: string | null) => void;
}

const ProductContext = createContext<ProductsContextType | undefined>(
  undefined,
);

interface ProductsProviderProps {
  children: ReactNode;
  initialProducts: Product[];
  meta?: PaginationMeta;
}

export function ProductsProvider({
  children,
  initialProducts,
  meta: initialMeta = null,
}: ProductsProviderProps) {
  const [prevInitialProducts, setPrevInitialProducts] =
    useState(initialProducts);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [updatedProductId, setUpdatedProductIdState] = useState<string | null>(
    null,
  );
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    setProducts(initialProducts);
    setMeta(initialMeta);
  }

  const setUpdatedProductId = useCallback((id: string | null) => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    setUpdatedProductIdState(id);
    if (id) {
      highlightTimeoutRef.current = setTimeout(() => {
        setUpdatedProductIdState(null);
      }, 1500);
    }
  }, []);

  const updateProductOptimistic = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, ...updates } : item,
        ),
      );
    },
    [],
  );

  const removeProductOptimistic = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    setProducts(initialProducts);
    setMeta(initialMeta);
  }, [initialProducts, initialMeta]);

  const value = useMemo(
    () => ({
      products,
      setProducts,
      initialProducts,
      meta,
      setMeta,
      searchQuery,
      setSearchQuery,
      isSearching,
      setIsSearching,
      resetSearch,
      updateProductOptimistic,
      removeProductOptimistic,
      updatedProductId,
      setUpdatedProductId,
    }),
    [
      products,
      initialProducts,
      meta,
      searchQuery,
      isSearching,
      resetSearch,
      updateProductOptimistic,
      removeProductOptimistic,
      updatedProductId,
      setUpdatedProductId,
    ],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider.");
  }
  return context;
}
