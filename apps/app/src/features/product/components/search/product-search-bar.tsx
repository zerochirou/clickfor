"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "../../lib/products-provider";
import { searchProducts } from "../../api/search-products";

interface ProductSearchBarProps {
  workspaceId: string;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
}

export function ProductSearchBar({
  workspaceId,
  debounceMs = 350,
  placeholder = "Cari produk berdasarkan nama, SKU, atau kategori...",
  className,
}: ProductSearchBarProps) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setProducts,
    setMeta,
    setSearchQuery,
    isSearching,
    setIsSearching,
    resetSearch,
  } = useProducts();

  // Local state for the input so user typing is 100% responsive and never overwritten
  const [inputValue, setInputValue] = useState<string>(() => {
    return searchParams.get("query") || "";
  });

  const activeRequestIdRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClear = useCallback(() => {
    // 1. Cancel any active debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // 2. Invalidate any in-flight requests
    activeRequestIdRef.current += 1;

    // 3. Immediately update UI state
    setInputValue("");
    setSearchQuery("");
    setIsSearching(false);
    resetSearch();

    inputRef.current?.focus();
  }, [resetSearch, setIsSearching, setSearchQuery]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus search, Esc to clear/blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (
        e.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        if (inputValue) {
          handleClear();
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputValue, handleClear]);

  const handleSearchChange = (value: string) => {
    // 1. Immediately update local input value so keystrokes/deletions are never blocked
    setInputValue(value);

    // 2. Cancel previous pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const trimmed = value.trim();

    // 3. When query is empty, reset immediately with 0 network calls
    if (!trimmed) {
      activeRequestIdRef.current += 1;
      setIsSearching(false);
      setSearchQuery("");
      resetSearch();
      return;
    }

    // 4. Update provider query for empty-state matching
    setSearchQuery(trimmed);

    // 5. Schedule safe debounce
    const currentRequestId = ++activeRequestIdRef.current;

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchProducts({
          workspaceId,
          query: trimmed,
          page: 1,
          limit: 10,
        });

        // Ensure we only apply results from the latest request to prevent race conditions
        if (currentRequestId === activeRequestIdRef.current) {
          setProducts(res.data);
          setMeta(res.meta);
        }
      } catch (err) {
        if (currentRequestId === activeRequestIdRef.current) {
          console.error("Pencarian produk gagal:", err);
        }
      } finally {
        if (currentRequestId === activeRequestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, debounceMs);
  };

  return (
    <InputGroup className={className}>
      <InputGroupInput
        ref={inputRef}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        {isSearching ? (
          <Spinner className="text-muted-foreground" />
        ) : inputValue ? (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={handleClear}
            title="Hapus pencarian (Esc)"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </InputGroupButton>
        ) : (
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </InputGroupAddon>
      <InputGroupAddon align="inline-start">
        <Search className="h-4 w-4 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
