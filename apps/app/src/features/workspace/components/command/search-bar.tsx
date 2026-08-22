"use client";

import { useState } from "react";
import { Menu } from "./menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <Button>
        Create <Plus />
      </Button>
      <div className="flex flex-col gap-4 w-full">
        <Input
          type="search"
          className="w-1/2 justify-end self-end bg-white/80 backdrop-blur-md"
          placeholder="Tulis perintah atau cari.."
          onClick={() => setIsOpen(true)}
        />
        <Menu open={isOpen} onOpenChange={setIsOpen} />
      </div>
    </div>
  );
}
