"use client";

import { Workspace } from "@/lib/types/workspace";
import { createContext, useContext, useState, ReactNode } from "react";

interface WorkspaceContextType {
  workspaces: Workspace[];
  setWorkspaces: (workspace: Workspace[]) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

interface WorkspaceProviderProps {
  children: ReactNode;
  initialWorkspaces: Workspace[];
}

export function WorkspaceProvider({
  children,
  initialWorkspaces,
}: WorkspaceProviderProps) {
  const [workspaces, setWorkspacess] = useState<Workspace[]>(initialWorkspaces);

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, setWorkspaces: setWorkspacess }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaces() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaces must be used within a WorkspaceProvider.");
  }
  return context;
}
