export interface Workspace {
  id: string;
  workspaceName: string;
  description: string | null;
  isActive: boolean;
  image: string | null;
  brandColor?: string | null;
  transparentSidebar?: boolean | null;
  sidebarFeature?: string | null;
  tablesView?: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}
