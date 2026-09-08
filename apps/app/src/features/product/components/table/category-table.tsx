"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FolderPlus, Layers, Package, Plus, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ProductCategory } from "@/lib/types/product";
import { CategoryTableAction } from "./category-table-action";
import { EditCategoryForm } from "../form/edit-category-form";
import { CreateCategoryForm } from "../form/create-category-form";

interface CategoryTableProps {
  initialCategories: ProductCategory[];
  workspaceId: string;
}

export function CategoryTable({
  initialCategories,
  workspaceId,
}: CategoryTableProps) {
  const [categories, setCategories] =
    useState<ProductCategory[]>(initialCategories);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<ProductCategory | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    const query = searchFilter.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query)),
    );
  }, [categories, searchFilter]);

  const handleEdit = (category: ProductCategory) => {
    setSelectedCategoryForEdit(category);
    setIsEditSheetOpen(true);
  };

  const handleEditSuccess = (updated: ProductCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat)),
    );
  };

  const handleDeleteSuccess = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  const handleCreateSuccess = (created: ProductCategory) => {
    setCategories((prev) => [
      {
        ...created,
        productCount: 0,
        _count: { products: 0 },
      },
      ...prev,
    ]);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Action Toolbar */}
      <div className="">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">
              Kategori Produk
            </h1>
            <Badge variant="secondary" className="font-mono text-xs">
              {categories.length} kategori
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola pengelompokan produk untuk mempermudah navigasi dan
            transaksi.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <InputGroup className="max-w-xs w-full">
            <InputGroupAddon align="inline-start">
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari kategori berdasarkan nama atau deskripsi..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            {searchFilter && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setSearchFilter("")}
                  title="Hapus pencarian"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/workspace/${workspaceId}/product`}>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-1.5 text-muted-foreground" />
              Lihat Produk
            </Button>
          </Link>
          <Link href={`/workspace/${workspaceId}/product/add-many`}>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-1.5 text-primary" />
              Tambah Banyak
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setIsCreateSheetOpen(true)}
            className="active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      {/* Categories Table Container */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-64 font-semibold">
                Nama Kategori
              </TableHead>
              <TableHead className="w-48 font-semibold">
                Jumlah Produk
              </TableHead>
              <TableHead className="w-40 font-semibold">
                Tanggal Dibuat
              </TableHead>
              <TableHead className="w-20 text-end font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {
                  const productCount =
                    category.productCount ?? category._count?.products ?? 0;

                  return (
                    <motion.tr
                      key={category.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: 0.98,
                        transition: { duration: 0.15 },
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-xl shrink-0 select-none shadow-2xs border">
                            {category.icon || "📁"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-foreground tracking-tight truncate">
                              {category.name}
                            </span>
                            {category.description ? (
                              <span className="text-xs text-muted-foreground line-clamp-1 truncate w-80">
                                {category.description}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/60 italic">
                                Tidak ada deskripsi
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={productCount > 0 ? "secondary" : "outline"}
                          className="font-medium gap-1.5"
                        >
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span>{productCount} Produk</span>
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {formatDate(category.createdAt)}
                      </TableCell>

                      <TableCell className="text-end">
                        <CategoryTableAction
                          category={category}
                          workspaceId={workspaceId}
                          onEdit={handleEdit}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </TableCell>
                    </motion.tr>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-64 text-center select-none"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <FolderPlus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {searchFilter
                            ? "Kategori tidak ditemukan"
                            : "Belum ada kategori produk"}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          {searchFilter
                            ? `Tidak ada kategori yang cocok dengan pencarian "${searchFilter}". Coba kata kunci lain.`
                            : "Buat kategori baru untuk mengelompokkan produk-produk di toko Anda."}
                        </p>
                      </div>
                      {!searchFilter && (
                        <Button
                          size="sm"
                          onClick={() => setIsCreateSheetOpen(true)}
                          className="mt-2"
                        >
                          <Plus className="mr-1.5 h-4 w-4" />
                          Buat Kategori Pertama
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Edit Category Sheet (Triggered from Table Action Dropdown) */}
      <EditCategoryForm
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        category={selectedCategoryForEdit}
        workspaceId={workspaceId}
        onSuccess={handleEditSuccess}
      />

      {/* Create Category Sheet */}
      <CreateCategoryForm
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        workspaceId={workspaceId}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
