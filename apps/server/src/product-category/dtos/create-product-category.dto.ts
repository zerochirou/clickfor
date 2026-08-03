import { IsOptional, IsString } from 'class-validator';

export class CreateProductCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  icon: string;
}
