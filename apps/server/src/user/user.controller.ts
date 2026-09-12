import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth.types';
import { GetAvatarPresignedUrlDTO } from './dtos/get-avatar-presigned-url.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('avatar/presigned-url')
  async getAvatarPresignedUploadUrl(
    @CurrentUser() user: AuthUser,
    @Query() query: GetAvatarPresignedUrlDTO,
  ) {
    return this.userService.getAvatarPresignedUploadUrl(
      user.id,
      query.fileName,
      query.contentType,
    );
  }

  @Get('profile')
  async getUserProfile(@CurrentUser() user: AuthUser) {
    return this.userService.getUserProfile(user.id);
  }
}
