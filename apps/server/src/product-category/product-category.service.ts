import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateProductCategoryDTO } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDTO } from './dtos/update-product-category.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

@Injectable()
export class ProductCategoryService {
  constructor(private db: DbService) {}

  public async createProductCategory(
    dto: CreateProductCategoryDTO,
    workspaceId: string,
  ) {
    try {
      return await this.db.productCategory.create({
        data: {
          ...dto,
          workspaceId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updateProductCategory(
    dto: UpdateProductCategoryDTO,
    productCategoryId: string,
  ) {
    try {
      return await this.db.productCategory.update({
        where: { id: productCategoryId },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deleteProductCategory(productCategoryId: string) {
    try {
      return await this.db.productCategory.delete({
        where: { id: productCategoryId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProductCategoryById(productCategoryId: string) {
    try {
      const productCategory = await this.db.productCategory.findUnique({
        where: { id: productCategoryId },
      });
      if (!productCategory) {
        throw new NotFoundException(`Product category not found`);
      }
      return productCategory;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getAllProductCategory(workspaceId: string) {
    try {
      return await this.db.productCategory.findMany({
        where: { workspaceId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
