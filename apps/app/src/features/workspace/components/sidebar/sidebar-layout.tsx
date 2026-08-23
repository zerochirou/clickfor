"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import WorkspaceSearchCommand from "../command/workspace-search-command";
import { Button } from "@/components/ui/button";
import { BellRing, PanelLeft, PanelRight } from "lucide-react";
import { ModeToggle } from "@/components/commons/theme-toggle/mode";

export function SidebarLayout({ children }: React.PropsWithChildren) {
  const { toggleSidebar, state } = useSidebar();
  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-sidebar border-none! shadow-none!">
        <header className="flex bg-sidebar h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant={"ghost"} size={"icon-lg"} onClick={toggleSidebar}>
              <PanelLeft
                className={`transition-transform duration-300 ease-in-out ${
                  state === "collapsed" ? "scale-x-[-1]" : "scale-x-100"
                }`}
              />
            </Button>
            <WorkspaceSearchCommand />
            <Button variant={"outline"} size={"icon-lg"}>
              <BellRing />
            </Button>
            <ModeToggle />
          </div>
        </header>
        <div className="bg-background h-full rounded-2xl">{children}</div>
      </SidebarInset>
    </>
  );
}
