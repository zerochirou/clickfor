import {
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  LayoutGrid,
  Package,
  LayoutTemplate,
  MousePointerClick,
} from "lucide-react";

export const navMainData = [
  {
    title: "Overview",
    url: "/",
    icon: <LayoutGrid />,
    isActive: true,
  },
  {
    title: "Produk",
    url: "/product",
    icon: <Package />,
    items: [
      {
        title: "Item",
        url: "/product/card",
      },
      {
        title: "Kategori",
        url: "/product/category",
      },
    ],
  },
  {
    title: "Halaman menu",
    url: "/menu",
    icon: <LayoutTemplate />,
    items: [
      {
        title: "Atur Layout",
        url: "#",
      },
      {
        title: "Publish",
        url: "#",
      },
    ],
  },
  {
    title: "Anggota",
    url: "/team",
    icon: <MousePointerClick />,
    items: [
      {
        title: "Tambah anggota",
        url: "/team/add",
      },
      {
        title: "Atur anggota",
        url: "/team/manage",
      },
    ],
  },
  {
    title: "Settings",
    url: "/setting",
    icon: <Settings2Icon />,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
];

export const navSecondaryData = [
  {
    title: "Support",
    url: "/support",
    icon: <LifeBuoyIcon />,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: <SendIcon />,
  },
];
