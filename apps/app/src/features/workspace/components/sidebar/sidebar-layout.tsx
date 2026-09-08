import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import { ModeToggle } from "@/components/commons/theme-toggle/mode";
import { SidebarTriggerButton } from "./sidebar-trigger-button";

export function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarInset className="">
      <header className="flex h-16 shrink-0 items-center gap-2 px-2">
        <div className="flex items-center gap-2">
          <SidebarTriggerButton />
          <Button variant={"outline"} size={"icon-lg"}>
            <BellRing />
          </Button>
          <ModeToggle />
        </div>
      </header>
      <div className="">
        {children}
      </div>
    </SidebarInset>
  );
}
