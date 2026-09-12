"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type TableDensity = "default" | "compact";

interface TableViewSelectorProps {
  value: TableDensity;
  onChange: (value: TableDensity) => void;
}

export function TableViewSelector({ value, onChange }: TableViewSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
      {/* 1. Default Table Mockup */}
      <div
        onClick={() => onChange("default")}
        className="flex flex-col gap-2 cursor-pointer group"
      >
        <div
          className={cn(
            "relative aspect-[16/10] rounded-2xl border-2 overflow-hidden transition-all bg-card p-2.5 flex flex-col gap-1.5",
            value === "default"
              ? "border-primary ring-2 ring-primary/20 shadow-xs"
              : "border-border/80 hover:border-muted-foreground/40",
          )}
        >
          <span className="text-[7px] font-semibold text-muted-foreground">
            Customer
          </span>
          <div className="h-px w-full bg-border" />

          {/* Spacious Rows */}
          <div className="flex flex-col gap-1.5 flex-1 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-muted-foreground/40 shrink-0" />
                <div className="h-1 w-10 bg-muted-foreground/30 rounded-xs" />
                <div className="h-1.5 w-6 bg-primary/20 rounded-full ml-auto" />
                <div className="h-1 w-4 bg-muted-foreground/20 rounded-xs ml-2" />
              </div>
            ))}
          </div>

          {/* Active Checkmark Pill */}
          {value === "default" && (
            <div className="absolute bottom-2 left-2 size-4.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Check className="size-3 stroke-[3]" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-center text-foreground">
          Default
        </span>
      </div>

      {/* 2. Compact Table Mockup */}
      <div
        onClick={() => onChange("compact")}
        className="flex flex-col gap-2 cursor-pointer group"
      >
        <div
          className={cn(
            "relative aspect-[16/10] rounded-2xl border-2 overflow-hidden transition-all bg-card p-2.5 flex flex-col gap-1",
            value === "compact"
              ? "border-primary ring-2 ring-primary/20 shadow-xs"
              : "border-border/80 hover:border-muted-foreground/40",
          )}
        >
          <span className="text-[7px] font-semibold text-muted-foreground">
            Customer
          </span>
          <div className="h-px w-full bg-border" />

          {/* Dense Rows */}
          <div className="flex flex-col gap-1 flex-1 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                <div className="h-0.5 w-10 bg-muted-foreground/30 rounded-xs" />
                <div className="h-1 w-6 bg-primary/20 rounded-full ml-auto" />
                <div className="h-0.5 w-4 bg-muted-foreground/20 rounded-xs ml-2" />
              </div>
            ))}
          </div>

          {/* Active Checkmark Pill */}
          {value === "compact" && (
            <div className="absolute bottom-2 left-2 size-4.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Check className="size-3 stroke-[3]" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-center text-foreground">
          Compact
        </span>
      </div>
    </div>
  );
}
