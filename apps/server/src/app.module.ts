import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    DbModule,
    AuthModule.forRoot({
      auth,
      bodyParser: false,
    }),
    WorkspaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
