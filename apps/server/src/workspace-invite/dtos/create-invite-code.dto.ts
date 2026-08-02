import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateInviteCodeDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsBoolean()
  @IsOptional()
  isPersistent: boolean;
}
