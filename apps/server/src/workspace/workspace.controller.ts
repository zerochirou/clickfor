import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { WorkspaceTransformer } from './transformers/workspace.transformer';
import { WorkspaceGuard } from './guards/workspace.guard';
import { MembersTransformer } from './transformers/members.transformer';
import { UpdateMemberDTO } from './dtos/update-member.dto';
import { WorkspaceRoleGuard } from './guards/workspace-role-guard.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  async createWorkspace(
    @Body() dto: CreateWorkspaceDTO,
    @Session() session: UserSession,
  ): Promise<WorkspaceTransformer> {
    const userId = session?.user?.id ?? session?.session?.userId;
    if (!userId) {
      throw new UnauthorizedException('You must login first.');
    }
    return new WorkspaceTransformer(
      await this.workspaceService.createWorkspace(dto, userId),
    );
  }

  @Patch('/:workspaceId')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async updateWorkspace(
    @Body() dto: UpdateWorkspaceDTO,
    @Session() session: UserSession,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceTransformer> {
    return new WorkspaceTransformer(
      await this.workspaceService.updateWorkspace(dto, workspaceId),
    );
  }

  @Delete('/:workspaceId')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.OWNER)
  async deleteWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.workspaceService.deleteWorkspace(workspaceId);
  }

  @Get('/:workspaceId')
  @UseGuards(WorkspaceGuard)
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
  async getAllWorkspaces(
    @Session() session: UserSession,
  ): Promise<WorkspaceTransformer[]> {
    const userId = session?.user?.id ?? session?.session?.userId;
    if (!userId) {
      throw new UnauthorizedException('You must login first.');
    }
    return (await this.workspaceService.getAllWorkspaces(userId)).map(
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
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async updateMember(
    @Body() dto: UpdateMemberDTO,
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ): Promise<MembersTransformer> {
    return new MembersTransformer(
      await this.workspaceService.updateMember(workspaceId, memberId, dto),
    );
  }

  @Get('/:workspaceId/me')
  @UseGuards(WorkspaceGuard)
  async getMemberBySession(
    @Param('workspaceId') workspaceId: string,
    @Session() session: UserSession,
  ): Promise<MembersTransformer> {
    return new MembersTransformer(
      await this.workspaceService.getMemberByUserId(
        session.session.userId,
        workspaceId,
      ),
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
