import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceInviteModule } from './workspace-invite/workspace-invite.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductModule } from './product/product.module';
import { PageModule } from './page/page.module';
import { PageThemeModule } from './page-theme/page-theme.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    DbModule,
    AuthModule.forRoot({
      auth,
      bodyParser: false,
    }),
    WorkspaceModule,
    WorkspaceInviteModule,
    ProductCategoryModule,
    ProductModule,
    PageModule,
    PageThemeModule,
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
