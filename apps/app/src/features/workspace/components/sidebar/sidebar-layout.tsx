"use client";

import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import WorkspaceSearchCommand from "../command/workspace-search-command";
import { Button } from "@/components/ui/button";
import { BellRing, PanelLeft } from "lucide-react";
import { ModeToggle } from "@/components/commons/theme-toggle/mode";
import { User } from "better-auth";

export function SidebarLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const { toggleSidebar, state } = useSidebar();
  return (
    <>
      <AppSidebar user={user} />
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
        <div className="bg-background h-full rounded-2xl border border-input overflow-y-auto!">
          {children}
        </div>
      </SidebarInset>
    </>
  );
}
