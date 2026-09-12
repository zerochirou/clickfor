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
import { PageService } from './page.service';
import { CreatePageDTO } from './dtos/create-page.dto';
import { UpdatePageDTO } from './dtos/update-page.dto';
import { WorkspaceGuard } from 'src/workspace/guards/workspace.guard';
import { WorkspaceRoleGuard } from 'src/workspace/guards/workspace-role-guard.guard';
import { Roles } from 'src/workspace/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('/workspace/:workspaceId/page')
export class PageController {
  constructor(private pageService: PageService) {}

  @Post()
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async createPage(
    @Body() dto: CreatePageDTO,
    @Param('workspaceId') workspaceId: string,
  ) {
    return await this.pageService.createPage(dto, workspaceId);
  }

  @Patch(':pageId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async updatePage(
    @Body() dto: UpdatePageDTO,
    @Param('workspaceId') workspaceId: string,
    @Param('pageId') pageId: string,
  ) {
    return await this.pageService.updatePage(dto, pageId, workspaceId);
  }

  @Delete(':pageId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async deletePage(
    @Param('workspaceId') workspaceId: string,
    @Param('pageId') pageId: string,
  ) {
    return await this.pageService.deletePage(pageId, workspaceId);
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  async getPages(@Param('workspaceId') workspaceId: string) {
    return await this.pageService.getPages(workspaceId);
  }

  @Get(':pageId')
  @UseGuards(WorkspaceGuard)
  async getPageById(
    @Param('workspaceId') workspaceId: string,
    @Param('pageId') pageId: string,
  ) {
    return await this.pageService.getPageById(pageId, workspaceId);
  }
}
