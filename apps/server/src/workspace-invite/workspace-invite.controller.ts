import {
  Body,
  Controller,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceGuard } from 'src/workspace/guards/workspace.guard';
import { WorkspaceInviteService } from './workspace-invite.service';
import { CreateInviteCodeDTO } from './dtos/create-invite-code.dto';
import { JoinCodeDTO } from './dtos/join-code.dto';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { InviteTransformer } from './transformers/invite.transformer';
import { JoinSuccessTransformer } from './transformers/join-success.transformer';

@Controller('workspace')
export class WorkspaceInviteController {
  constructor(private workspaceInviteService: WorkspaceInviteService) {}

  @Post(':workspaceId/invite')
  @UseGuards(WorkspaceGuard)
  async createInviteCode(
    @Body() dto: CreateInviteCodeDTO,
    @Param('workspaceId') workspaceId: string,
  ): Promise<InviteTransformer> {
    return this.workspaceInviteService.createInviteCode(dto, workspaceId);
  }

  @Post('join')
  async joinWithCode(
    @Body() dto: JoinCodeDTO,
    @Session() session: UserSession,
  ): Promise<JoinSuccessTransformer> {
    await this.workspaceInviteService.joinWithCode(dto, session.session.userId);
    return new JoinSuccessTransformer({ isSuccess: true });
  }
}
