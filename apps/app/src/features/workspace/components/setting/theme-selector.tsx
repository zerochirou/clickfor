"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

type ThemeMode = "system" | "light" | "dark";

interface ThemeSelectorProps {
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeSelector({
  currentTheme: propTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const activeTheme = (propTheme || (mounted ? theme : "system")) as ThemeMode;

  const handleSelect = (mode: ThemeMode) => {
    setTheme(mode);
    onThemeChange?.(mode);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
      {/* 1. System Preference Mockup */}
      <div
        onClick={() => handleSelect("system")}
        className="flex flex-col gap-2 cursor-pointer group"
      >
        <div
          className={cn(
            "relative aspect-[16/10] rounded-2xl border-2 overflow-hidden transition-all bg-muted/40",
            activeTheme === "system"
              ? "border-primary ring-2 ring-primary/20 shadow-xs"
              : "border-border/80 hover:border-muted-foreground/40",
          )}
        >
          {/* Window Mockup Content: Split Light/Dark */}
          <div className="size-full flex">
            {/* Left Half: Light */}
            <div className="w-1/2 bg-[#F8FAFC] p-2 flex flex-col gap-1.5 border-r border-border/40">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="size-1.5 rounded-full bg-red-400" />
                <div className="size-1.5 rounded-full bg-amber-400" />
                <div className="size-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex gap-1.5 flex-1">
                {/* Mini Sidebar */}
                <div className="w-1/3 flex flex-col gap-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                  <div className="h-1 w-3/4 bg-slate-200 rounded-xs" />
                  <div className="h-1 w-4/5 bg-slate-200 rounded-xs" />
                </div>
                {/* Mini Main */}
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[6px] font-medium text-slate-700 leading-none">
                    Your dashboard
                  </span>
                  <div className="h-5 w-full bg-white rounded-xs border border-slate-200/80 shadow-2xs" />
                </div>
              </div>
            </div>

            {/* Right Half: Dark */}
            <div className="w-1/2 bg-[#18181B] p-2 flex flex-col gap-1.5">
              <div className="h-2" />
              <div className="flex gap-1.5 flex-1">
                {/* Mini Sidebar */}
                <div className="w-1/3 flex flex-col gap-1">
                  <div className="h-1.5 w-full bg-zinc-700 rounded-xs" />
                  <div className="h-1 w-3/4 bg-zinc-800 rounded-xs" />
                  <div className="h-1 w-4/5 bg-zinc-800 rounded-xs" />
                </div>
                {/* Mini Main */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-1 w-2/3 bg-zinc-700 rounded-xs" />
                  <div className="h-5 w-full bg-zinc-900 rounded-xs border border-zinc-800 shadow-2xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Checkmark Pill */}
          {activeTheme === "system" && (
            <div className="absolute bottom-2 left-2 size-4.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Check className="size-3 stroke-[3]" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-center text-foreground">
          Preferensi sistem
        </span>
      </div>

      {/* 2. Light Theme Mockup */}
      <div
        onClick={() => handleSelect("light")}
        className="flex flex-col gap-2 cursor-pointer group"
      >
        <div
          className={cn(
            "relative aspect-[16/10] rounded-2xl border-2 overflow-hidden transition-all bg-[#F8FAFC]",
            activeTheme === "light"
              ? "border-primary ring-2 ring-primary/20 shadow-xs"
              : "border-border/80 hover:border-muted-foreground/40",
          )}
        >
          <div className="size-full p-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="size-1.5 rounded-full bg-red-400" />
              <div className="size-1.5 rounded-full bg-amber-400" />
              <div className="size-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex gap-2 flex-1">
              {/* Mini Sidebar */}
              <div className="w-1/4 flex flex-col gap-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                <div className="h-1 w-3/4 bg-slate-200 rounded-xs" />
                <div className="h-1 w-4/5 bg-slate-200 rounded-xs" />
                <div className="h-1 w-2/3 bg-slate-200 rounded-xs" />
              </div>
              {/* Mini Dashboard */}
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[6px] font-medium text-slate-700 leading-none">
                  Your dashboard
                </span>
                <div className="h-7 w-full bg-white rounded-xs border border-slate-200/80 shadow-2xs" />
              </div>
            </div>
          </div>

          {/* Active Checkmark Pill */}
          {activeTheme === "light" && (
            <div className="absolute bottom-2 left-2 size-4.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Check className="size-3 stroke-[3]" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-center text-foreground">
          Light
        </span>
      </div>

      {/* 3. Dark Theme Mockup */}
      <div
        onClick={() => handleSelect("dark")}
        className="flex flex-col gap-2 cursor-pointer group"
      >
        <div
          className={cn(
            "relative aspect-[16/10] rounded-2xl border-2 overflow-hidden transition-all bg-[#18181B]",
            activeTheme === "dark"
              ? "border-primary ring-2 ring-primary/20 shadow-xs"
              : "border-border/80 hover:border-muted-foreground/40",
          )}
        >
          <div className="size-full p-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="size-1.5 rounded-full bg-red-400/80" />
              <div className="size-1.5 rounded-full bg-amber-400/80" />
              <div className="size-1.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex gap-2 flex-1">
              {/* Mini Sidebar */}
              <div className="w-1/4 flex flex-col gap-1">
                <div className="h-1.5 w-full bg-zinc-700 rounded-xs" />
                <div className="h-1 w-3/4 bg-zinc-800 rounded-xs" />
                <div className="h-1 w-4/5 bg-zinc-800 rounded-xs" />
                <div className="h-1 w-2/3 bg-zinc-800 rounded-xs" />
              </div>
              {/* Mini Dashboard */}
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[6px] font-medium text-zinc-300 leading-none">
                  Your dashboard
                </span>
                <div className="h-7 w-full bg-zinc-900 rounded-xs border border-zinc-800 shadow-2xs" />
              </div>
            </div>
          </div>

          {/* Active Checkmark Pill */}
          {activeTheme === "dark" && (
            <div className="absolute bottom-2 left-2 size-4.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Check className="size-3 stroke-[3]" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-center text-foreground">
          Dark
        </span>
      </div>
    </div>
  );
}
