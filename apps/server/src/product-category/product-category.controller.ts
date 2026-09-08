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
import { CreateProductCategoryBulkDTO } from './dtos/create-product-category-bulk.dto';
import { UpdateProductCategoryDTO } from './dtos/update-product-category.dto';
import { WorkspaceGuard } from 'src/workspace/guards/workspace.guard';
import { OptionalAuth } from '@thallesp/nestjs-better-auth';
import { ProductCategoryTransformer } from './transformers/product-category.transformer';

@Controller('/workspace/:workspaceId/product/category')
export class ProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Post('/bulk')
  @UseGuards(WorkspaceGuard)
  async createProductCategoryBulk(
    @Body() dto: CreateProductCategoryBulkDTO,
    @Param('workspaceId') workspaceId: string,
  ): Promise<ProductCategoryTransformer[]> {
    const categories =
      await this.productCategoryService.createProductCategoryBulk(
        dto,
        workspaceId,
      );
    return categories.map(
      (category) => new ProductCategoryTransformer(category),
    );
  }

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
    @Param('workspaceId') workspaceId: string,
    @Param('productCategoryId') productCategoryId: string,
  ): Promise<ProductCategoryTransformer> {
    return new ProductCategoryTransformer(
      await this.productCategoryService.updateProductCategory(
        dto,
        productCategoryId,
        workspaceId,
      ),
    );
  }

  @Delete('/:productCategoryId')
  @UseGuards(WorkspaceGuard)
  async deleteProductCategory(
    @Param('workspaceId') workspaceId: string,
    @Param('productCategoryId') productCategoryId: string,
  ): Promise<void> {
    await this.productCategoryService.deleteProductCategory(
      productCategoryId,
      workspaceId,
    );
  }

  @Get('/:productCategoryId')
  @OptionalAuth()
  async getProductCategoryById(
    @Param('workspaceId') workspaceId: string,
    @Param('productCategoryId') productCategoryId: string,
  ): Promise<ProductCategoryTransformer> {
    return new ProductCategoryTransformer(
      await this.productCategoryService.getProductCategoryById(
        productCategoryId,
        workspaceId,
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
