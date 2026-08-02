import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { DbModule } from 'src/db/db.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  imports: [DbModule, WorkspaceModule],
})
export class ProductCategoryModule {}
