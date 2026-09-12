import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { auth } from 'src/auth';
import type { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { DbService } from 'src/db/db.service';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private db: DbService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authReq = request as AuthenticatedRequest;

    // 1. Session verification & caching
    if (!authReq.user || !authReq.session) {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session || !session.user) {
        throw new UnauthorizedException('You must login first.');
      }

      authReq.user = session.user;
      authReq.session = session.session;
    }

    const userId = authReq.user.id;
    const body = request.body as Record<string, unknown> | undefined;
    const query = request.query as Record<string, unknown> | undefined;
    const workspaceId =
      (request.params?.workspaceId as string) ||
      (typeof body?.workspaceId === 'string' ? body.workspaceId : undefined) ||
      (typeof query?.workspaceId === 'string' ? query.workspaceId : undefined);

    if (!workspaceId) {
      throw new NotFoundException('Workspace not found.');
    }

    // 2. Fast-path: Check if workspace membership is already resolved
    if (
      authReq.workspaceMember &&
      authReq.workspaceMember.workspaceId === workspaceId
    ) {
      return true;
    }

    // 3. Single compound unique query for membership + workspace
    const member = await this.db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      include: {
        workspace: true,
      },
    });

    if (!member) {
      const workspaceExists = await this.db.workspace.findUnique({
        where: { id: workspaceId },
        select: { id: true },
      });

      if (!workspaceExists) {
        throw new NotFoundException('Workspace not found.');
      }

      throw new ForbiddenException(
        'You do not have permission to access or modify this item.',
      );
    }

    if (!member.workspace.isActive) {
      throw new ForbiddenException('This workspace is currently inactive.');
    }

    // 4. Attach resolved workspace and membership context to request
    authReq.workspace = member.workspace;
    authReq.workspaceMember = member;
    authReq.memberRole = member.role;

    return true;
  }
}
