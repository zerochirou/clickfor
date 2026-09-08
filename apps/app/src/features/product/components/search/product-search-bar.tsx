"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setProducts,
    setMeta,
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    resetSearch,
  } = useProducts();

  const [, startTransition] = useTransition();
  const activeRequestIdRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update URL search params cleanly without full page refresh
  const syncUrl = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      params.delete("page"); // Reset page to 1 when search changes
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  const handleClear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    activeRequestIdRef.current += 1;
    resetSearch();
    syncUrl("");
    inputRef.current?.focus();
  }, [resetSearch, syncUrl]);

  // Sync with initial URL search params on mount if available
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

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
        if (searchQuery) {
          handleClear();
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, handleClear]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Cancel previous pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = value.trim();

    // If query is emptied, restore initial products immediately without network request
    if (!trimmed) {
      activeRequestIdRef.current += 1;
      resetSearch();
      syncUrl("");
      return;
    }

    setIsSearching(true);
    const currentRequestId = ++activeRequestIdRef.current;

    debounceTimerRef.current = setTimeout(async () => {
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
          syncUrl(trimmed);
        }
      } catch (err) {
        console.error("Search failed:", err);
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
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        {isSearching ? (
          <Spinner className="text-muted-foreground" />
        ) : searchQuery ? (
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
