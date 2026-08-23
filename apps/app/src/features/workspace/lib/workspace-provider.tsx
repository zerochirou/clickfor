"use client";

import { Workspace } from "@/lib/types/workspace";
import { createContext, useContext, useState, ReactNode } from "react";

interface WorkspaceContextType {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

interface WorkspaceProviderProps {
  children: ReactNode;
  initialWorkspace: Workspace;
}

export function WorkspaceProvider({
  children,
  initialWorkspace,
}: WorkspaceProviderProps) {
  const [workspace, setWorkspaces] = useState<Workspace>(initialWorkspace);

  return (
    <WorkspaceContext.Provider
      value={{ workspace, setWorkspace: setWorkspaces }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider.");
  }
  return context;
}
