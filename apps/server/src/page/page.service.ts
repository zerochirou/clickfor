import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreatePageDTO } from './dtos/create-page.dto';
import { UpdatePageDTO } from './dtos/update-page.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

@Injectable()
export class PageService {
  constructor(private db: DbService) {}

  public async createPage(dto: CreatePageDTO, workspaceId: string) {
    const { themeId, ...rest } = dto;
    try {
      if (themeId) {
        await this.db.pageTheme.findFirstOrThrow({
          where: { id: themeId, workspaceId },
        });
      }

      return await this.db.page.create({
        data: {
          workspace: { connect: { id: workspaceId } },
          theme: themeId ? { connect: { id: themeId } } : undefined,
          ...rest,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updatePage(
    dto: UpdatePageDTO,
    pageId: string,
    workspaceId: string,
  ) {
    try {
      await this.db.page.findFirstOrThrow({
        where: { id: pageId, workspaceId },
      });

      const { themeId, ...rest } = dto;
      if (themeId) {
        await this.db.pageTheme.findFirstOrThrow({
          where: { id: themeId, workspaceId },
        });
      }

      return await this.db.page.update({
        where: { id: pageId },
        data: {
          theme: themeId ? { connect: { id: themeId } } : undefined,
          ...rest,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deletePage(pageId: string, workspaceId: string) {
    try {
      await this.db.page.findFirstOrThrow({
        where: { id: pageId, workspaceId },
      });

      return await this.db.page.delete({
        where: { id: pageId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getPageById(pageId: string, workspaceId: string) {
    try {
      return await this.db.page.findFirstOrThrow({
        where: { id: pageId, workspaceId },
        include: {
          theme: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getPages(workspaceId: string) {
    try {
      return await this.db.page.findMany({
        where: { workspaceId },
        include: {
          theme: true,
        },
        orderBy: {
          title: 'asc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
