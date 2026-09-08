"use client";

import { Input } from "@/components/ui/input";
import WorkspaceCommand from "./workspace-command";
import { useState } from "react";
import { Search } from "lucide-react"; // 1. Import ikon Search dari lucide-react

export default function WorkspaceSearchCommand() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 2. Tambahkan wrapper div dengan posisi relative dan sesuaikan lebarnya */}
      <div className="relative">
        {/* 3. Posisikan ikon di sebelah kiri tengah secara absolute */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          type="search"
          className="w-full pl-9" // 4. Ubah ke w-full dan tambahkan pl-9 agar teks tidak menabrak ikon
          placeholder="Ketikan '/' untuk membuka perintah"
          onClick={() => setIsOpen(true)}
        />
      </div>

      <WorkspaceCommand open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}
