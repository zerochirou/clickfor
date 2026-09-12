import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { auth } from 'src/auth';
import type { AuthenticatedRequest } from 'src/auth/types/auth.types';
import { DbService } from 'src/db/db.service';
import { ROLES_KEY } from 'src/workspace/decorators/role.decorator';

export const ROLE_HIERARCHY: Record<Role, number> = {
  STAFF: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
};

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private db: DbService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const authReq = request as AuthenticatedRequest;

    try {
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
        (typeof body?.workspaceId === 'string'
          ? body.workspaceId
          : undefined) ||
        (typeof query?.workspaceId === 'string'
          ? query.workspaceId
          : undefined);

      if (!workspaceId) {
        throw new ForbiddenException('Workspace ID not found in request.');
      }

      // 2. Reuse cached workspace member if already verified by WorkspaceGuard
      let member = authReq.workspaceMember;
      if (!member || member.workspaceId !== workspaceId) {
        const dbMember = await this.db.workspaceMember.findUnique({
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

        if (!dbMember) {
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

        if (!dbMember.workspace.isActive) {
          throw new ForbiddenException('This workspace is currently inactive.');
        }

        member = dbMember;
        authReq.workspace = dbMember.workspace;
        authReq.workspaceMember = dbMember;
        authReq.memberRole = dbMember.role;
      }

      // 3. Validate Role Hierarchy if required
      if (requiredRoles && requiredRoles.length > 0) {
        const userRoleLevel = ROLE_HIERARCHY[member.role] || 0;

        const hasAccess = requiredRoles.some((role) => {
          const requiredLevel = ROLE_HIERARCHY[role] || 0;
          return userRoleLevel >= requiredLevel;
        });

        if (!hasAccess) {
          throw new ForbiddenException(
            'You do not have the required role to perform this action.',
          );
        }
      }

      return true;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired session.');
    }
  }
}
