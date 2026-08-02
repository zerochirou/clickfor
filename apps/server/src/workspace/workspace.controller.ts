import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { WorkspaceTransformer } from './transformers/workspace.transformer';
import { WorkspaceGuard } from './guards/workspace.guard';
import { MembersTransformer } from './transformers/members.transformer';
import { UpdateMemberDTO } from './dtos/update-member.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  async createWorkspace(
    @Body() dto: CreateWorkspaceDTO,
    @Session() session: UserSession,
  ): Promise<WorkspaceTransformer> {
    return new WorkspaceTransformer(
      await this.workspaceService.createWorkspace(dto, session.session.userId),
    );
  }

  @Patch('/:workspaceId')
  @UseGuards(WorkspaceGuard)
  async updateWorkspace(
    @Body() dto: CreateWorkspaceDTO,
    @Session() session: UserSession,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceTransformer> {
    return new WorkspaceTransformer(
      await this.workspaceService.updateWorkspace(dto, workspaceId),
    );
  }

  @Delete('/:workspaceId')
  @UseGuards(WorkspaceGuard)
  async deleteWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.workspaceService.deleteWorkspace(workspaceId);
  }

  @Get('/:workspaceId')
  @UseGuards(WorkspaceGuard)
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
    return (
      await this.workspaceService.getAllWorkspaces(session.session.userId)
    ).map((workspace) => new WorkspaceTransformer(workspace));
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
