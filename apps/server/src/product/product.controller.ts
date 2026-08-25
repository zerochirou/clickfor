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
    @Param('productId') productId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.updateProduct(dto, productId),
    );
  }

  @Delete(':productId')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceRoleGuard)
  @Roles(Role.ADMIN)
  async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.deleteProduct(productId),
    );
  }

  @Get('/category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductTransformer[]> {
    return this.productService
      .getProductsByCategory(categoryId)
      .then((products) =>
        products.map((product) => new ProductTransformer(product)),
      );
  }

  @Get('/search')
  async searchProducts(
    @Query('query') query: string,
  ): Promise<ProductTransformer[]> {
    return await this.productService
      .searchProducts(query)
      .then((products) =>
        products.map((product) => new ProductTransformer(product)),
      );
  }

  @Get()
  async getProducts(
    @Param('workspaceId') workspaceId: string,
  ): Promise<ProductTransformer[]> {
    return this.productService
      .getProducts(workspaceId)
      .then((products) =>
        products.map((product) => new ProductTransformer(product)),
      );
  }

  @Get(':productId')
  async getProductById(
    @Param('productId') productId: string,
  ): Promise<ProductTransformer> {
    return new ProductTransformer(
      await this.productService.getProductById(productId),
    );
  }
}
