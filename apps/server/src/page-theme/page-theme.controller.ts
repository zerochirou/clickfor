import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PageThemeService } from './page-theme.service';
import { CreateThemeDTO } from './dtos/create-theme.dto';
import { UpdateThemeDTO } from './dtos/update-theme.dto';
import { WorkspaceGuard } from 'src/workspace/guards/workspace.guard';

@Controller('/workspace/:workspaceId/page/theme')
export class PageThemeController {
  constructor(private pageThemeService: PageThemeService) {}

  @Post()
  @UseGuards(WorkspaceGuard)
  async createPageTheme(
    @Body() dto: CreateThemeDTO,
    @Param('workspaceId') workspaceId: string,
  ) {
    return await this.pageThemeService.createPageTheme(dto, workspaceId);
  }

  @Patch(':themeId')
  @UseGuards(WorkspaceGuard)
  async updatePageTheme(
    @Body() dto: UpdateThemeDTO,
    @Param('workspaceId') workspaceId: string,
    @Param('themeId') themeId: string,
  ) {
    return await this.pageThemeService.updatePageTheme(
      dto,
      themeId,
      workspaceId,
    );
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  async getPageThemes(@Param('workspaceId') workspaceId: string) {
    return await this.pageThemeService.getPageThemes(workspaceId);
  }

  @Get(':themeId')
  @UseGuards(WorkspaceGuard)
  async getPageThemeById(
    @Param('workspaceId') workspaceId: string,
    @Param('themeId') themeId: string,
  ) {
    return await this.pageThemeService.getPageThemeById(themeId, workspaceId);
  }

  @Delete(':themeId')
  @UseGuards(WorkspaceGuard)
  async deletePageTheme(
    @Param('workspaceId') workspaceId: string,
    @Param('themeId') themeId: string,
  ) {
    return await this.pageThemeService.deletePageTheme(themeId, workspaceId);
  }
}
