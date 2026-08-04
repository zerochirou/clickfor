import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePageDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  themeId: string;
}
