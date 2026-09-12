import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { DbModule } from 'src/db/db.module';
import { WorkspaceGuard } from './guards/workspace.guard';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGuard],
  imports: [DbModule, StorageModule, ConfigModule],
  exports: [WorkspaceGuard, WorkspaceService],
})
export class WorkspaceModule {}
