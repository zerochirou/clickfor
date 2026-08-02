import { $Enums } from '@prisma/client';

export class MembersTransformer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
  userId: string;
  role: $Enums.Role;

  constructor(partial: Partial<MembersTransformer>) {
    Object.assign(this, partial);
  }
}
