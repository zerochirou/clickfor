export class InviteTransformer {
  id: string;
  code: string;
  message: string | null;
  isActive: boolean;
  isPersistent: boolean;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;

  constructor(partial: Partial<InviteTransformer>) {
    Object.assign(this, partial);
  }
}
