import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateInviteCodeDTO } from './dtos/create-invite-code.dto';
import { JoinCodeDTO } from './dtos/join-code.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import { generateInviteCode } from 'src/common/utils/gen-invite-code';

@Injectable()
export class WorkspaceInviteService {
  constructor(private db: DbService) {}

  public async createInviteCode(dto: CreateInviteCodeDTO, workspaceId: string) {
    try {
      return await this.db.workspaceJoinCode.create({
        data: {
          ...dto,
          workspace: {
            connect: { id: workspaceId },
          },
          code: generateInviteCode(),
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async joinWithCode(dto: JoinCodeDTO, userId: string) {
    try {
      return await this.db.$transaction(async (tx) => {
        const workspaceCode = await tx.workspaceJoinCode.findUnique({
          where: { code: dto.code },
        });
        if (!workspaceCode || !workspaceCode.isActive) {
          throw new NotFoundException('Workspace not found');
        }
        const isUserExist = await tx.workspaceMember.findUnique({
          where: {
            workspaceId_userId: {
              workspaceId: workspaceCode.workspaceId,
              userId: userId,
            },
          },
        });
        if (isUserExist) {
          throw new ConflictException('User already exists in workspace');
        }
        if (!workspaceCode.isPersistent) {
          await tx.workspaceJoinCode.delete({
            where: { id: workspaceCode.id },
          });
        }
        await tx.workspaceMember.create({
          data: {
            role: 'STAFF',
            user: {
              connect: {
                id: userId,
              },
            },
            workspace: {
              connect: {
                id: workspaceCode.workspaceId,
              },
            },
          },
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getAllCodes(workspaceId: string) {
    try {
      return await this.db.workspaceJoinCode.findMany({
        where: { workspaceId: workspaceId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
