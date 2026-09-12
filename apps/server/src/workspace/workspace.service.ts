import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import { UpdateMemberDTO } from './dtos/update-member.dto';
import { ROLE_HIERARCHY } from './guards/workspace-role-guard.guard';

@Injectable()
export class WorkspaceService {
  constructor(private db: DbService) {}

  public async createWorkspace(dto: CreateWorkspaceDTO, userId: string) {
    try {
      return await this.db.$transaction(async (tx) => {
        const workspace = await tx.workspace.create({
          data: {
            ...dto,
            owner: {
              connect: {
                id: userId,
              },
            },
          },
        });

        await tx.workspaceMember.create({
          data: {
            workspace: {
              connect: {
                id: workspace.id,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
            role: 'OWNER',
          },
        });

        return workspace;
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updateWorkspace(dto: UpdateWorkspaceDTO, workspaceId: string) {
    try {
      return await this.db.workspace.update({
        where: {
          id: workspaceId,
        },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deleteWorkspace(workspaceId: string) {
    try {
      return await this.db.workspace.delete({
        where: {
          id: workspaceId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getAllWorkspaces(userId: string) {
    try {
      return await this.db.workspace.findMany({
        where: {
          workspaceMembers: {
            some: {
              userId: userId,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getWorkspaceById(workspaceId: string) {
    try {
      const workspace = await this.db.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });
      if (!workspace) {
        throw new NotFoundException('Workspace not found');
      }
      return workspace;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getAllMembers(workspaceId: string) {
    try {
      return await this.db.workspaceMember.findMany({
        where: {
          workspaceId: workspaceId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updateMember(
    workspaceId: string,
    memberId: string,
    dto: UpdateMemberDTO,
    actorUserId?: string,
  ) {
    try {
      const targetMember = await this.db.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId: workspaceId,
        },
      });

      if (!targetMember) {
        throw new NotFoundException('Member not found in workspace.');
      }

      // Security check: actor cannot change their own role
      if (actorUserId && targetMember.userId === actorUserId) {
        throw new ForbiddenException('You cannot modify your own role.');
      }

      // Security check: actor role validation against target member
      if (actorUserId) {
        const actorMember = await this.db.workspaceMember.findUnique({
          where: {
            workspaceId_userId: {
              workspaceId,
              userId: actorUserId,
            },
          },
        });

        if (!actorMember) {
          throw new ForbiddenException(
            'You are not a member of this workspace.',
          );
        }

        const actorLevel = ROLE_HIERARCHY[actorMember.role] || 0;
        const targetLevel = ROLE_HIERARCHY[targetMember.role] || 0;
        const newRoleLevel = ROLE_HIERARCHY[dto.role] || 0;

        // An actor cannot demote or modify someone of equal or higher hierarchy (unless OWNER)
        if (actorMember.role !== 'OWNER' && targetLevel >= actorLevel) {
          throw new ForbiddenException(
            'You cannot modify members with equal or higher role.',
          );
        }

        // An actor cannot promote someone to a role higher than their own
        if (actorMember.role !== 'OWNER' && newRoleLevel >= actorLevel) {
          throw new ForbiddenException(
            'You cannot assign a role equal to or higher than your own.',
          );
        }
      }

      // Owner role assignment restriction
      if (dto.role === 'OWNER') {
        throw new ForbiddenException(
          'Owner role cannot be assigned directly. Use ownership transfer.',
        );
      }

      // Target member is current owner restriction
      if (targetMember.role === 'OWNER') {
        throw new ForbiddenException('Cannot modify the workspace owner.');
      }

      return await this.db.workspaceMember.update({
        where: {
          id: memberId,
        },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getMemberByUserId(userId: string, workspaceId: string) {
    try {
      const member = await this.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId,
          },
        },
      });
      if (!member) {
        throw new NotFoundException('Member not found');
      }
      return member;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getMemberById(memberId: string, workspaceId: string) {
    try {
      const member = await this.db.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId: workspaceId,
        },
      });
      if (!member) {
        throw new NotFoundException('Member not found');
      }
      return member;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
