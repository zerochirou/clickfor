import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [DbModule],
})
export class WorkspaceModule {}
