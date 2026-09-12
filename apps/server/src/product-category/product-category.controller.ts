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
import { WorkspaceRoleGuard } from 'src/workspace/guards/workspace-role-guard.guard';
import { Roles } from 'src/workspace/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ProductCategoryTransformer } from './transformers/product-category.transformer';

@Controller('/workspace/:workspaceId/product/category')
export class ProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Post('/bulk')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async createProductCategory(
    @Body() dto: CreateProductCategoryDTO,
    @Param('workspaceId') workspaceId: string,
  ): Promise<ProductCategoryTransformer> {
    return new ProductCategoryTransformer(
      await this.productCategoryService.createProductCategory(dto, workspaceId),
    );
  }

  @Patch('/:productCategoryId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(WorkspaceGuard)
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
  @UseGuards(WorkspaceGuard)
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
