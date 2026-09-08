"use client";

import { Workspace } from "@/lib/types/workspace";
import { useParams } from "next/navigation";
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
  initialWorkspace?: Workspace | null;
}

export function WorkspaceProvider({
  children,
  initialWorkspace,
}: WorkspaceProviderProps) {
  const params = useParams<{ workspaceId?: string }>();
  const [prevInitialWorkspace, setPrevInitialWorkspace] =
    useState(initialWorkspace);
  const [workspace, setWorkspaces] = useState<Workspace>(() => {
    if (initialWorkspace) return initialWorkspace;
    return {
      id: params?.workspaceId ?? "",
      workspaceName: "",
      description: null,
      isActive: true,
      image: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      ownerId: "",
    };
  });

  if (initialWorkspace && initialWorkspace !== prevInitialWorkspace) {
    setPrevInitialWorkspace(initialWorkspace);
    setWorkspaces(initialWorkspace);
  }

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
