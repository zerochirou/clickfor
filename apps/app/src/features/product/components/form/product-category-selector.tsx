import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { ProductCategory } from "@/lib/types/product";

interface ProductCategorySelectorProps {
  productCategory: ProductCategory[];
  value?: string; // Menerima ID kategori (string)
  onSelect: (categoryId: string) => void;
  onOpen?: () => void;
}

export function ProductCategorySelector({
  productCategory,
  value,
  onSelect,
  onOpen,
}: ProductCategorySelectorProps) {
  // Cari item yang dipilih untuk ditampilkan di input, atau ambil format string-nya
  const selectedItem = productCategory.find((item) => item.id === value);

  return (
    <Combobox
      items={productCategory}
      // Pass value sebagai string (id) atau objek jika library mendukungnya,
      // tapi jika error JSON, biasanya dia butuh string/id atau properti khusus.
      value={value}
      onValueChange={(item: ProductCategory | string | null) => {
        if (!item) {
          onSelect("");
          return;
        }
        // Handle jika item berupa objek atau string id
        const selectedId = typeof item === "string" ? item : item.id;
        onSelect(selectedId);
      }}
      onOpenChange={(isOpen) => {
        if (isOpen && onOpen) {
          onOpen();
        }
      }}
    >
      {/* Jika ComboboxInput mendukung display value kustom */}
      <ComboboxInput
        placeholder="Pilih Kategori Produk"
        // Jika komponen input Anda menerima display value secara manual:
        value={selectedItem ? `${selectedItem.name} ${selectedItem.icon}` : ""}
        readOnly
      />
      <ComboboxContent>
        <ComboboxEmpty>Kategori tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: ProductCategory) => (
            <ComboboxItem key={item.id} value={item.id}>
              {item.name} {item.icon}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
