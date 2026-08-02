import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { DbModule } from 'src/db/db.module';
import { WorkspaceGuard } from './guards/workspace.guard';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGuard],
  imports: [DbModule],
  exports: [WorkspaceGuard],
})
export class WorkspaceModule {}
