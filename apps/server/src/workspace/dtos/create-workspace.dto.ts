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
  image: string;
}
