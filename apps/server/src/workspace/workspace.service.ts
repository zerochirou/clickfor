import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

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
}
