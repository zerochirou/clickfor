import type { Request } from 'express';
import type { auth } from '../../auth';

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
  session: AuthSession;
}
