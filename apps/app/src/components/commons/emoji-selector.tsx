"use client";

import { useState } from "react";
import EmojiPicker, {
  EmojiClickData,
  Theme,
} from "emoji-picker-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

interface EmojiSelectorProps {
  value?: string;
  onChange?: (emoji: string) => void;
}

export function EmojiSelector({
  value,
  onChange,
}: EmojiSelectorProps) {
  const [open, setOpen] = useState(false);

  const { theme } = useTheme();

  function handleEmojiClick(data: EmojiClickData) {
    onChange?.(data.emoji);
    setOpen(false);
  }

  const emojiTheme =
    theme === "light"
      ? Theme.LIGHT
      : theme === "dark"
        ? Theme.DARK
        : Theme.AUTO;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="size-10 p-0 text-xl border-dashed border-2"
          >
            {value || "🍔"}
          </Button>
        }
      />

      <PopoverContent
        className="w-auto p-2 rounded-sm bg-none border-none"
        align="start"
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          lazyLoadEmojis
          className="bg-popover! border-none!"
          autoFocusSearch={false}
          theme={emojiTheme}
          width={320}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
}