import {
  LayoutGrid,
  Package,
  LayoutTemplate,
  MousePointerClick,
  Plus,
  FilePlusCorner,
  UserIcon,
} from "lucide-react";

export const commandsData = [
  {
    group: "Navigasi",
    items: [
      { icon: LayoutGrid, label: "Overview", shortcut: "⌘H" },
      { icon: Package, label: "Produk", shortcut: "⌘I" },
      { icon: LayoutTemplate, label: "Halaman", shortcut: "⌘P" },
      { icon: MousePointerClick, label: "Anggota tim", shortcut: "⌘T" },
    ],
  },
  {
    group: "Aksi",
    items: [
      { icon: Plus, label: "Buat produk", shortcut: "⌘K" },
      { icon: FilePlusCorner, label: "Buat halaman", shortcut: "⌘," },
      { icon: UserIcon, label: "Undang anggota", shortcut: "⌘U" },
    ],
  },
];