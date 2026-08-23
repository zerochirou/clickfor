"use client";

import * as React from "react";
import {
  CreditCardIcon,
  GitMerge,
  LayoutTemplate,
  LogOut,
  Plus,
  SettingsIcon,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useWorkspaces } from "../../lib/workspaces-provider";
import Link from "next/link";
import { handleLogout } from "@/features/auth/lib/handle-logout";

interface MenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Menu({ open, onOpenChange }: MenuProps) {
  const { workspaces } = useWorkspaces();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Tulis perintah atau cari..." />
        <CommandList>
          <CommandEmpty>Hasil tidak ditemukan.</CommandEmpty>
          <CommandGroup heading="Workspaces">
            {workspaces.map((workspace) => (
              <Link
                href={`/workspace/${workspace.id}`}
                key={workspace.id}
                prefetch="auto"
              >
                <CommandItem>
                  <LayoutTemplate />
                  <span>{workspace.workspaceName}</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Aksi">
            <CommandItem>
              <Plus />
              <span>Buat baru</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GitMerge />
              <span>Bergabung</span>
              <CommandShortcut>⌘J</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon />
              <span>Tagihan</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon />
              <span>Pengaturan</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <div onClick={handleLogout}>
              <CommandItem>
                <LogOut />
                <span>Keluar</span>
                <CommandShortcut>⌘O</CommandShortcut>
              </CommandItem>
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
