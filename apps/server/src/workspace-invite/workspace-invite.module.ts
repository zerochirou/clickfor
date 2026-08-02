import { Module } from '@nestjs/common';
import { WorkspaceInviteService } from './workspace-invite.service';
import { WorkspaceInviteController } from './workspace-invite.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [WorkspaceInviteService],
  controllers: [WorkspaceInviteController],
  imports: [DbModule, WorkspaceModule],
})
export class WorkspaceInviteModule {}
