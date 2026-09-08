import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DbModule } from 'src/db/db.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { StorageModule } from 'src/storage/storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [DbModule, WorkspaceModule, StorageModule, ConfigModule],
})
export class ProductModule {}
