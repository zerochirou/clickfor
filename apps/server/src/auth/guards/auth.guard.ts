import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { auth } from '../../auth';
import type { AuthenticatedRequest } from '../types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authReq = request as AuthenticatedRequest;

    if (authReq.user && authReq.session) {
      return true;
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session || !session.user) {
      throw new UnauthorizedException('You must login first.');
    }

    authReq.user = session.user;
    authReq.session = session.session;

    return true;
  }
}
