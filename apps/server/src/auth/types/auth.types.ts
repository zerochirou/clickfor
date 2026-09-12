import type { Request } from 'express';
import type { Role, Workspace, WorkspaceMember } from '@prisma/client';
import type { auth } from '../../auth';

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
  session: AuthSession;
  workspace?: Partial<Workspace> & { id: string };
  workspaceMember?: WorkspaceMember & {
    workspace?: Partial<Workspace> & { id: string };
  };
  memberRole?: Role;
}
