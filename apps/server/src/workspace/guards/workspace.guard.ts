import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { auth } from 'src/auth';
import { DbService } from 'src/db/db.service';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private db: DbService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session || !session.user) {
      throw new UnauthorizedException('You must login first.');
    }

    const userId = session.user.id;
    const workspaceId = request.params.workspaceId as string;

    if (!workspaceId) {
      throw new NotFoundException('Workspace not found.');
    }

    const workspace = await this.db.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }
    const isUserExist = await this.db.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, userId: userId },
    });
    if (!isUserExist) {
      throw new ForbiddenException(
        'You do not have permission to access or modify this item.',
      );
    }
    return true;
  }
}
