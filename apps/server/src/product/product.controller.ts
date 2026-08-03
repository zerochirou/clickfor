import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Controller('/workspace/:workspaceId/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/category/:categoryId')
  async createProduct(
    @Body() dto: CreateProductDTO,
    @Param('categoryId') categoryId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.productService.createProduct(dto, categoryId, workspaceId);
  }

  @Patch(':productId')
  async updateProduct(
    @Body() dto: UpdateProductDTO,
    @Param('productId') productId: string,
  ) {
    return this.productService.updateProduct(dto, productId);
  }

  @Get('/search')
  async searchProducts(@Query('query') query: string) {
    return await this.productService.searchProducts(query);
  }

  @Get()
  async getProducts(@Param('workspaceId') workspaceId: string) {
    return this.productService.getProducts(workspaceId);
  }

  @Get(':productId')
  async getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }
}
