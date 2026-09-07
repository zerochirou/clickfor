"use client";

import { useEffect, useRef, useTransition } from "react";
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
  const syncUrl = (term: string) => {
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
  };

  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    activeRequestIdRef.current += 1;
    resetSearch();
    syncUrl("");
    inputRef.current?.focus();
  };

  // Sync with initial URL search params on mount if available
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, []);

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
  }, [searchQuery]);


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

    // Set loading indicator
    setIsSearching(true);

    const requestId = ++activeRequestIdRef.current;

    // Debounce ("bouncer") timer
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts({
          workspaceId,
          query: trimmed,
        });

        // Ensure we only update if this is still the freshest request (anti-race condition)
        if (requestId === activeRequestIdRef.current) {
          setProducts(results.data);
          setMeta(results.meta);
          setIsSearching(false);
          syncUrl(trimmed);
        }
      } catch (err) {
        if (requestId === activeRequestIdRef.current) {
          console.error("Failed to search products:", err);
          setIsSearching(false);
        }
      }
    }, debounceMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <InputGroup className={`w-full max-w-sm sm:max-w-md ${className ?? ""}`}>
      <InputGroupAddon align="inline-start">
        {isSearching ? (
          <Spinner className="size-4 text-primary" />
        ) : (
          <Search className="size-4 text-muted-foreground" />
        )}
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        aria-label="Cari produk"
      />
      <InputGroupAddon align="inline-end">
        {searchQuery ? (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={handleClear}
            aria-label="Hapus pencarian"
          >
            <X className="size-3.5" />
          </InputGroupButton>
        ) : (
          <kbd
            className="hidden sm:inline-flex select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
            title="Tekan ⌘K untuk mencari"
          >
            <span className="text-[11px]">⌘</span>K
          </kbd>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}


