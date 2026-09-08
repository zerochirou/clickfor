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
      return await this.db.$transaction(async (tx) => {
        const workspace = await tx.workspace.update({
          where: {
            id: workspaceId,
          },
          data: dto,
        });

        return workspace;
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
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updateMember(
    workspaceId: string,
    memberId: string,
    dto: UpdateMemberDTO,
  ) {
    try {
      if (dto.role === 'OWNER') {
        throw new ForbiddenException('Cannot update owner role');
      }
      return await this.db.$transaction(async (tx) => {
        await tx.workspaceMember.findFirstOrThrow({
          where: {
            id: memberId,
            workspaceId: workspaceId,
          },
        });
        return await tx.workspaceMember.update({
          where: {
            id: memberId,
          },
          data: dto,
        });
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
