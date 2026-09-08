"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function SidebarTriggerButton() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button variant={"ghost"} size={"icon-lg"} onClick={toggleSidebar}>
      <PanelLeft
        className={`transition-transform duration-300 ease-in-out ${
          state === "collapsed" ? "scale-x-[-1]" : "scale-x-100"
        }`}
      />
    </Button>
  );
}
