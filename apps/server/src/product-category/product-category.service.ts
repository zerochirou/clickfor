import { Injectable } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { CreateProductCategoryDTO } from './dtos/create-product-category.dto';
import { CreateProductCategoryBulkDTO } from './dtos/create-product-category-bulk.dto';
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

  public async createProductCategoryBulk(
    dto: CreateProductCategoryBulkDTO | CreateProductCategoryDTO[],
    workspaceId: string,
  ): Promise<ProductCategory[]> {
    try {
      const categories = Array.isArray(dto) ? dto : dto.categories;
      const skipDuplicates =
        Array.isArray(dto) || dto.skipDuplicates === undefined
          ? true
          : dto.skipDuplicates;

      if (!categories || categories.length === 0) {
        return [];
      }

      // Map DTO to Prisma input format
      const data = categories.map((category) => ({
        name: category.name.trim(),
        description: category.description ?? null,
        icon: category.icon ?? null,
        workspaceId,
      }));

      // In-memory deduplication based on unique key [workspaceId, name]
      // Keeps the last item in the list if duplicate names are submitted within the same payload
      const uniqueDataMap = new Map<string, (typeof data)[0]>();
      for (const item of data) {
        uniqueDataMap.set(item.name, item);
      }
      const sanitizedData = Array.from(uniqueDataMap.values());

      const CHUNK_SIZE = 1000;
      if (sanitizedData.length <= CHUNK_SIZE) {
        return await this.db.productCategory.createManyAndReturn({
          data: sanitizedData,
          skipDuplicates,
        });
      }

      // For massive payloads (>1000 records), chunk within a single transaction
      return await this.db.$transaction(async (tx) => {
        const results: ProductCategory[] = [];
        for (let i = 0; i < sanitizedData.length; i += CHUNK_SIZE) {
          const chunk = sanitizedData.slice(i, i + CHUNK_SIZE);
          const chunkResult = await tx.productCategory.createManyAndReturn({
            data: chunk,
            skipDuplicates,
          });
          results.push(...chunkResult);
        }
        return results;
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updateProductCategory(
    dto: UpdateProductCategoryDTO,
    productCategoryId: string,
    workspaceId: string,
  ) {
    try {
      await this.db.productCategory.findFirstOrThrow({
        where: { id: productCategoryId, workspaceId },
      });
      return await this.db.productCategory.update({
        where: { id: productCategoryId },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deleteProductCategory(
    productCategoryId: string,
    workspaceId: string,
  ) {
    try {
      await this.db.productCategory.findFirstOrThrow({
        where: { id: productCategoryId, workspaceId },
      });
      return await this.db.productCategory.delete({
        where: { id: productCategoryId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProductCategoryById(
    productCategoryId: string,
    workspaceId: string,
  ) {
    try {
      const productCategory = await this.db.productCategory.findFirstOrThrow({
        where: { id: productCategoryId, workspaceId },
      });
      return productCategory;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getAllProductCategory(workspaceId: string) {
    try {
      return await this.db.productCategory.findMany({
        where: { workspaceId },
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
