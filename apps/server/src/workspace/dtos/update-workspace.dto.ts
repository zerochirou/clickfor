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
  image: string;
}
