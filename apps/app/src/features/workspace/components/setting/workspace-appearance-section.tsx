"use client";

import { Switch } from "@/components/ui/switch";
import { ThemeSelector } from "./theme-selector";

interface WorkspaceAppearanceSectionProps {
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  disabled?: boolean;
}

export function WorkspaceAppearanceSection({
  isActive,
  onIsActiveChange,
  disabled = false,
}: WorkspaceAppearanceSectionProps) {
  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <h2 className="text-xl font-bold text-foreground font-space-grostek">
        Appearance & Preferences
      </h2>
      <div className="border-b border-border/70 mt-3 mb-6" />

      <div className="flex flex-col gap-8">
        {/* 1. Interface Theme */}
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Tema Antarmuka
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pilih mode tampilan tema antarmuka yang sesuai dengan preferensi
              Anda.
            </p>
          </div>
          <ThemeSelector />
        </div>

        {/* 2. Workspace Status Switch Row */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-medium text-foreground">
              Status Operasional Workspace
            </h4>
            <p className="text-xs text-muted-foreground">
              {isActive
                ? "Workspace aktif dan dapat diakses oleh anggota tim serta pelanggan."
                : "Workspace dinonaktifkan sementara."}
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={onIsActiveChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
