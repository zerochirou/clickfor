import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/db/db.module';
import { StorageModule } from 'src/storage/storage.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DbModule, StorageModule, ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
