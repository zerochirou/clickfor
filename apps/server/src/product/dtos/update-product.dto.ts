import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  purchasePrice: number;

  @IsNumber()
  @IsOptional()
  salePrice: number;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsNumber()
  @IsOptional()
  minStock: number;

  @IsString()
  @IsOptional()
  unit: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  isUp: boolean;
}
