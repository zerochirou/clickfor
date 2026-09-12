"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const PRESET_COLORS = [
  { name: "Black", value: "#0F172A" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Indigo", value: "#4F46E5" },
  { name: "Royal Blue", value: "#2C68F6" },
  { name: "Sky Blue", value: "#0284C7" },
  { name: "Teal", value: "#0D9488" },
  { name: "Green", value: "#16A34A" },
];

interface BrandColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function BrandColorPicker({ color, onChange }: BrandColorPickerProps) {
  const nativeColorInputRef = useRef<HTMLInputElement>(null);

  const safeColor = color || "#2C68F6";
  const cleanHex = safeColor.replace(/^#/, "").toUpperCase();

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    onChange(`#${val}`);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Preset Circles */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {PRESET_COLORS.map((preset) => {
          const isSelected = color.toLowerCase() === preset.value.toLowerCase();
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={cn(
                "size-7 rounded-full transition-transform hover:scale-110 cursor-pointer relative",
                isSelected &&
                  "ring-2 ring-offset-2 ring-accent ring-offset-background scale-105",
              )}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          );
        })}
      </div>

      {/* Custom Color Input Row */}
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
        <span>Custom color:</span>
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-muted-foreground font-mono">
            #
          </span>
          <Input
            type="text"
            value={cleanHex}
            onChange={handleHexChange}
            className="w-28 h-8 pl-6 pr-2 font-mono text-xs uppercase rounded-lg border-border"
            maxLength={6}
          />
        </div>

        {/* Color swatch trigger */}
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => nativeColorInputRef.current?.click()}
            className="size-7 rounded-full border border-border shadow-xs cursor-pointer ring-2 ring-offset-2 ring-accent ring-offset-background transition-transform hover:scale-105"
            style={{ backgroundColor: color }}
            title="Pilih warna custom"
          />
          <input
            ref={nativeColorInputRef}
            type="color"
            value={
              color.startsWith("#") && color.length === 7 ? color : "#2C68F6"
            }
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 absolute inset-0 size-0 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
