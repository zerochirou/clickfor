import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateThemeDTO } from './dtos/create-theme.dto';
import { UpdateThemeDTO } from './dtos/update-theme.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

@Injectable()
export class PageThemeService {
  constructor(private db: DbService) {}

  public async createPageTheme(dto: CreateThemeDTO, workspaceId: string) {
    try {
      return await this.db.pageTheme.create({
        data: {
          ...dto,
          workspaceId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updatePageTheme(dto: UpdateThemeDTO, themeId: string) {
    try {
      return await this.db.pageTheme.update({
        where: { id: themeId },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deletePageTheme(themeId: string) {
    try {
      return await this.db.pageTheme.delete({
        where: { id: themeId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getPageThemes(workspaceId: string) {
    try {
      return await this.db.pageTheme.findMany({
        where: { workspaceId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getPageThemeById(themeId: string) {
    try {
      return await this.db.pageTheme.findUnique({
        where: { id: themeId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
