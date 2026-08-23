"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
  
import { commandsData } from "../../lib/command-data";

interface MenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WorkspaceCommand({ open, onOpenChange }: MenuProps) {


  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <CommandInput placeholder="Ketikan '/' untuk membuka perintah" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandsData.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    console.log(`Selected: ${item.label}`);
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
