import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceInviteModule } from './workspace-invite/workspace-invite.module';
import { ProductCategoryModule } from './product-category/product-category.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
