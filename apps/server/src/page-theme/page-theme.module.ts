import { Module } from '@nestjs/common';
import { PageThemeController } from './page-theme.controller';
import { PageThemeService } from './page-theme.service';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [PageThemeController],
  providers: [PageThemeService],
  exports: [PageThemeService, WorkspaceModule, DbModule],
})
export class PageThemeModule {}
