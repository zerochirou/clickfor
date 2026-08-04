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
    @Param('themeId') themeId: string,
  ) {
    return await this.pageThemeService.updatePageTheme(dto, themeId);
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  async getPageThemes(@Param('workspaceId') workspaceId: string) {
    return await this.pageThemeService.getPageThemes(workspaceId);
  }

  @Get(':themeId')
  @UseGuards(WorkspaceGuard)
  async getPageThemeById(@Param('themeId') themeId: string) {
    return await this.pageThemeService.getPageThemeById(themeId);
  }

  @Delete(':themeId')
  @UseGuards(WorkspaceGuard)
  async deletePageTheme(@Param('themeId') themeId: string) {
    return await this.pageThemeService.deletePageTheme(themeId);
  }
}
