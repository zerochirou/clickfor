"use client";

import * as React from "react";
import { XIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 flex h-9 w-full items-center justify-between bg-brand-black px-4 text-xs font-normal text-white transition-all"
    >
      <div className="mx-auto flex items-center gap-2.5 truncate">
        <span className="mono-tag text-[11px] text-brand-softcoral">
          [ SYSTEM // RELEASE 08 ]
        </span>
        <span className="hidden md:inline text-white/90">
          Command R+ & Embed v3.5 are now generally available for enterprise RAG
          and private cloud deployment.
        </span>
        <span className="md:hidden text-white/90">
          Command R+ 08-2024 is now available.
        </span>
        <a
          href="#research"
          className="inline-flex items-center gap-1 font-medium text-white underline underline-offset-4 hover:text-brand-softcoral transition-colors"
        >
          Read benchmark paper
          <ArrowRightIcon className="size-3 inline" />
        </a>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setIsVisible(false)}
        className="text-white/60 hover:text-white hover:bg-white/10 rounded-full shrink-0"
        aria-label="Dismiss announcement"
      >
        <XIcon className="size-3.5" />
      </Button>
    </aside>
  );
}
