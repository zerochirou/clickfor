import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateWorkspaceDTO {
  @IsString()
  @IsOptional()
  workspaceName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  image?: string | null;

  @IsString()
  @IsOptional()
  brandColor?: string | null;

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
