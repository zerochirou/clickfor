import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DbModule } from 'src/db/db.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [DbModule, WorkspaceModule],
})
export class ProductModule {}
