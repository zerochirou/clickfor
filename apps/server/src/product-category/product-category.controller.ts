import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDTO } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDTO } from './dtos/update-product-category.dto';
import { WorkspaceGuard } from 'src/workspace/guards/workspace.guard';
import { OptionalAuth } from '@thallesp/nestjs-better-auth';
import { ProductCategoryTransformer } from './transformers/product-category.transformer';

@Controller('/workspace/:workspaceId/product/category')
export class ProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Post()
  @UseGuards(WorkspaceGuard)
  async createProductCategory(
    @Body() dto: CreateProductCategoryDTO,
    @Param('workspaceId') workspaceId: string,
  ): Promise<ProductCategoryTransformer> {
    return new ProductCategoryTransformer(
      await this.productCategoryService.createProductCategory(dto, workspaceId),
    );
  }

  @Patch('/:productCategoryId')
  @UseGuards(WorkspaceGuard)
  async updateProductCategory(
    @Body() dto: UpdateProductCategoryDTO,
    @Param('productCategoryId') productCategoryId: string,
  ): Promise<ProductCategoryTransformer> {
    return new ProductCategoryTransformer(
      await this.productCategoryService.updateProductCategory(
        dto,
        productCategoryId,
      ),
    );
  }

  @Delete('/:productCategoryId')
  @UseGuards(WorkspaceGuard)
  async deleteProductCategory(
    @Param('productCategoryId') productCategoryId: string,
  ): Promise<void> {
    await this.productCategoryService.deleteProductCategory(productCategoryId);
  }

  @Get('/:productCategoryId')
  @OptionalAuth()
  async getProductCategoryById(
    @Param('productCategoryId') productCategoryId: string,
  ): Promise<ProductCategoryTransformer> {
    return new ProductCategoryTransformer(
      await this.productCategoryService.getProductCategoryById(
        productCategoryId,
      ),
    );
  }

  @Get()
  @OptionalAuth()
  async getProductCategoriesByWorkspace(
    @Param('workspaceId') workspaceId: string,
  ): Promise<ProductCategoryTransformer[]> {
    return this.productCategoryService
      .getAllProductCategory(workspaceId)
      .then((categories) =>
        categories.map((category) => new ProductCategoryTransformer(category)),
      );
  }
}
