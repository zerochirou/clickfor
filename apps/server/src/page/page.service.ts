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

  public async updatePage(dto: UpdatePageDTO, pageId: string) {
    try {
      const { themeId, ...rest } = dto;
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

  public async deletePage(pageId: string) {
    try {
      return await this.db.page.delete({
        where: { id: pageId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getPageById(pageId: string) {
    try {
      return await this.db.page.findUnique({
        where: { id: pageId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getAllPageProperties(pageId: string) {
    try {
      return await this.db.page.findMany({
        where: { id: pageId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getPages(workspaceId: string) {
    try {
      return await this.db.page.findMany({
        where: { workspaceId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
