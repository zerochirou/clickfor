import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { ProductTransformer } from './transformers/product.transformer';
import { PaginationProductQueryDTO } from './dtos/pagination-product-query.dto';
import { WorkspaceGuard } from 'src/workspace/guards/workspace.guard';
import { WorkspaceRoleGuard } from 'src/workspace/guards/workspace-role-guard.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/workspace/decorators/role.decorator';

@Controller('/workspace/:workspaceId/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/category/:categoryId')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async createProduct(
    @Body() dto: CreateProductDTO,
    @Param('categoryId') categoryId: string,
    @Param('workspaceId') workspaceId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.createProduct(dto, categoryId, workspaceId),
    );
  }

  @Get('presigned-url')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async getProductImageUploadURL(
    @Query('fileName') fileName: string,
    @Query('contentType') contentType: string,
  ) {
    const presignedURL = await this.productService.uploadProductImage(
      fileName,
      contentType,
    );
    return presignedURL;
  }

  @Patch(':productId')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async updateProduct(
    @Body() dto: UpdateProductDTO,
    @Param('workspaceId') workspaceId: string,
    @Param('productId') productId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.updateProduct(dto, productId, workspaceId),
    );
  }

  @Delete(':productId')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async deleteProduct(
    @Param('workspaceId') workspaceId: string,
    @Param('productId') productId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.deleteProduct(productId, workspaceId),
    );
  }

  @Get('/category/:categoryId')
  @UseGuards(WorkspaceGuard)
  async getProductsByCategory(
    @Param('workspaceId') workspaceId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<ProductTransformer[]> {
    return this.productService
      .getProductsByCategory(categoryId, workspaceId)
      .then((products) =>
        products.map((product) => new ProductTransformer(product)),
      );
  }

  @Get('/search')
  @UseGuards(WorkspaceGuard)
  async searchProducts(
    @Param('workspaceId') workspaceId: string,
    @Query('query') query: string,
    @Query() pagination: PaginationProductQueryDTO,
  ) {
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;
    const result = await this.productService.searchProducts(
      query,
      workspaceId,
      page,
      limit,
    );

    return {
      data: result.data.map((product) => new ProductTransformer(product)),
      meta: result.meta,
    };
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  async getProducts(
    @Param('workspaceId') workspaceId: string,
    @Query() pagination: PaginationProductQueryDTO,
  ) {
    const page = pagination.page ? Number(pagination.page) : 1;
    const limit = pagination.limit ? Number(pagination.limit) : 10;
    const result = await this.productService.getProducts(
      workspaceId,
      page,
      limit,
    );

    return {
      data: result.data.map((product) => new ProductTransformer(product)),
      meta: result.meta,
    };
  }

  @Get(':productId')
  @UseGuards(WorkspaceGuard)
  async getProductById(
    @Param('workspaceId') workspaceId: string,
    @Param('productId') productId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.getProductById(productId, workspaceId),
    );
  }
}
