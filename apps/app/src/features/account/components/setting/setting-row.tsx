import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingRowProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  alignTop?: boolean;
}

export function SettingRow({
  title,
  description,
  children,
  className,
  alignTop = false,
}: SettingRowProps) {
  return (
    <div
      className={cn(
        "py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 border-b border-border/60 last:border-b-0",
        alignTop && "md:items-start",
        className,
      )}
    >
      <div className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground font-space-grostek">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-1 w-full flex items-center">{children}</div>
    </div>
  );
}
