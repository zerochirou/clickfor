import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDTO {
  @IsString()
  workspaceName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  brandColor?: string;

  @IsBoolean()
  @IsOptional()
  transparentSidebar?: boolean;

  @IsString()
  @IsOptional()
  sidebarFeature?: string;

  @IsString()
  @IsOptional()
  tablesView?: string;
}
