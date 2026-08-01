import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';

@Module({
  imports: [
    DbModule,
    AuthModule.forRoot({
      auth,
      bodyParser: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
