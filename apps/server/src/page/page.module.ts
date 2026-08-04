import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { DbModule } from 'src/db/db.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  controllers: [PageController],
  providers: [PageService],
  imports: [DbModule, WorkspaceModule],
})
export class PageModule {}
