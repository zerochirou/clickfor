import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { WorkspaceRoleGuard } from 'src/workspace/guards/workspace-role-guard.guard';
import { Roles } from 'src/workspace/decorators/role.decorator';
import { Role } from '@prisma/client';
import { WorkspaceInviteService } from './workspace-invite.service';
import { CreateInviteCodeDTO } from './dtos/create-invite-code.dto';
import { JoinCodeDTO } from './dtos/join-code.dto';
import { InviteTransformer } from './transformers/invite.transformer';
import { JoinSuccessTransformer } from './transformers/join-success.transformer';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth.types';

@Controller('workspace')
export class WorkspaceInviteController {
  constructor(private workspaceInviteService: WorkspaceInviteService) {}

  @Post(':workspaceId/invite')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async createInviteCode(
    @Body() dto: CreateInviteCodeDTO,
    @Param('workspaceId') workspaceId: string,
  ): Promise<InviteTransformer> {
    return this.workspaceInviteService.createInviteCode(dto, workspaceId);
  }

  @Post('join')
  @UseGuards(AuthGuard)
  async joinWithCode(
    @Body() dto: JoinCodeDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<JoinSuccessTransformer> {
    await this.workspaceInviteService.joinWithCode(dto, user.id);
    return new JoinSuccessTransformer({ isSuccess: true });
  }
}
