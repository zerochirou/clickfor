export class WorkspaceTransformer {
  workspaceName: string;
  description: string | null;
  isActive: boolean;
  image: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;

  constructor(partial: Partial<WorkspaceTransformer>) {
    Object.assign(this, partial);
  }
}
