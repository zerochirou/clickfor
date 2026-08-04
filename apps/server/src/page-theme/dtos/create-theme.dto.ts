import { ThemeMode } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateThemeDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  mode: ThemeMode;

  @IsString()
  @IsOptional()
  primaryColor: string;

  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @IsString()
  @IsOptional()
  textColor?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  borderRadius: string;

  @IsString()
  @IsOptional()
  fontFamily?: string;
}
