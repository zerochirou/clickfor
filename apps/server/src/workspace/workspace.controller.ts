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
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto';
import { WorkspaceTransformer } from './transformers/workspace.transformer';
import { WorkspaceGuard } from './guards/workspace.guard';
import { MembersTransformer } from './transformers/members.transformer';
import { UpdateMemberDTO } from './dtos/update-member.dto';
import { WorkspaceRoleGuard } from './guards/workspace-role-guard.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth.types';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createWorkspace(
    @Body() dto: CreateWorkspaceDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<WorkspaceTransformer> {
    return new WorkspaceTransformer(
      await this.workspaceService.createWorkspace(dto, user.id),
    );
  }

  @Patch('/:workspaceId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async updateWorkspace(
    @Body() dto: UpdateWorkspaceDTO,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceTransformer> {
    return new WorkspaceTransformer(
      await this.workspaceService.updateWorkspace(dto, workspaceId),
    );
  }

  @Delete('/:workspaceId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.OWNER)
  async deleteWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.workspaceService.deleteWorkspace(workspaceId);
  }

  @Get('/:workspaceId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.STAFF)
  async getWorkspaceById(
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceTransformer> {
    return new WorkspaceTransformer(
      await this.workspaceService.getWorkspaceById(workspaceId),
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllWorkspaces(
    @CurrentUser() user: AuthUser,
  ): Promise<WorkspaceTransformer[]> {
    return (await this.workspaceService.getAllWorkspaces(user.id)).map(
      (workspace) => new WorkspaceTransformer(workspace),
    );
  }

  @Get('/:workspaceId/members')
  @UseGuards(WorkspaceGuard)
  async getAllMembers(
    @Param('workspaceId') workspaceId: string,
  ): Promise<MembersTransformer[]> {
    return (await this.workspaceService.getAllMembers(workspaceId)).map(
      (member) => new MembersTransformer(member),
    );
  }

  @Patch('/:workspaceId/member/:memberId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async updateMember(
    @Body() dto: UpdateMemberDTO,
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: AuthUser,
  ): Promise<MembersTransformer> {
    return new MembersTransformer(
      await this.workspaceService.updateMember(
        workspaceId,
        memberId,
        dto,
        user.id,
      ),
    );
  }

  @Get('/:workspaceId/me')
  @UseGuards(WorkspaceGuard)
  async getMemberBySession(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: AuthUser,
  ): Promise<MembersTransformer> {
    return new MembersTransformer(
      await this.workspaceService.getMemberByUserId(user.id, workspaceId),
    );
  }

  @Get('/:workspaceId/member/:memberId')
  @UseGuards(WorkspaceGuard)
  async getMemberById(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ): Promise<MembersTransformer> {
    return new MembersTransformer(
      await this.workspaceService.getMemberById(workspaceId, memberId),
    );
  }
}
