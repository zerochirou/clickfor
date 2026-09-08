import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateProductCategoryDTO } from './create-product-category.dto';

export class CreateProductCategoryBulkDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductCategoryDTO)
  categories: CreateProductCategoryDTO[];

  @IsBoolean()
  @IsOptional()
  skipDuplicates?: boolean;
}
