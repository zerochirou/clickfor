"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TerminalIcon } from "lucide-react";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { useWorkspace } from "../../lib/workspace-provider";
import { navMainData, navSecondaryData } from "../../lib/sidebar-data";
import { User } from "better-auth";
import { Workspace } from "@/lib/types/workspace";
import WorkspaceSearchCommand from "../command/workspace-search-command";

export function AppSidebar({
  user,
  workspace: workspaceProp,
}: {
  user: User;
  workspace?: Workspace;
}) {
  const { workspace: contextWorkspace } = useWorkspace();
  const workspace = workspaceProp ?? contextWorkspace;

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">
                  {workspace.workspaceName}
                </span>
                <span className="truncate text-xs">Free Plan</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <WorkspaceSearchCommand />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
