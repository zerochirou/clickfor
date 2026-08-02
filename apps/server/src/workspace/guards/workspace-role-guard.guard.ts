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
import { Request } from 'express';
import { auth } from 'src/auth';
import { DbService } from 'src/db/db.service';
import { ROLES_KEY } from 'src/workspace/decorators/role.decorator';

const ROLE_HIERARCHY: Record<Role, number> = {
  STAFF: 1,
  ADMIN: 2,
  MANAGER: 3,
  OWNER: 4,
};

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private db: DbService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Ambil role yang dibutuhkan dari metadata (jika ada)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: Request = context.switchToHttp().getRequest();
    try {
      const webHeaders = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          webHeaders.set(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => webHeaders.append(key, v));
        }
      });

      const session = await auth.api.getSession({
        headers: webHeaders,
      });

      if (!session || !session.user) {
        throw new UnauthorizedException('You must login first.');
      }

      const userId = session.user.id;
      const workspaceId = request.params.workspaceId as string;

      if (!workspaceId) {
        throw new ForbiddenException('Item ID not found in request.');
      }

      const workspace = await this.db.workspace.findUnique({
        where: { id: workspaceId },
      });

      if (!workspace) {
        throw new NotFoundException('Item not found.');
      }

      // 2. Cek keanggotaan user di workspace beserta rolenya
      const member = await this.db.workspaceMember.findFirst({
        where: { workspaceId: workspace.id, userId: userId },
      });

      if (!member) {
        throw new ForbiddenException(
          'You do not have permission to access or modify this item.',
        );
      }

      // 3. Jika endpoint memerlukan role tertentu, lakukan validasi hierarki
      if (requiredRoles && requiredRoles.length > 0) {
        const userRoleLevel = ROLE_HIERARCHY[member.role] || 0;

        // Cek apakah user memiliki salah satu role yang memenuhi atau melebihi batas minimal
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
