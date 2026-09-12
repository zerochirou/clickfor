export class WorkspaceTransformer {
  workspaceName: string;
  description: string | null;
  isActive: boolean;
  image: string | null;
  brandColor: string | null;
  transparentSidebar: boolean | null;
  sidebarFeature: string | null;
  tablesView: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;

  constructor(partial: Partial<WorkspaceTransformer>) {
    Object.assign(this, partial);
  }
}
