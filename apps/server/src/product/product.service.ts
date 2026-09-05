import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import { generateSKU } from 'src/common/utils/gen-sku-code';
import { ConfigService } from '@nestjs/config';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class ProductService {
  constructor(
    private db: DbService,
    private configService: ConfigService,
    private storageService: StorageService,
  ) {}
  // WARN: the barcode is generated from the SKU, not from the EAN13 standard, if the EAN13 field is provided, it will be ignored
  public async createProduct(
    dto: CreateProductDTO,
    categoryId: string,
    workspaceId: string,
  ) {
    try {
      return this.db.$transaction(async (tx) => {
        const category = await tx.productCategory.findFirstOrThrow({
          where: {
            id: categoryId,
            workspaceId,
          },
        });
        const sku = generateSKU({ category: category.name });
        const product = await tx.product.create({
          data: {
            ...dto,
            sku,
            workspace: {
              connect: {
                id: workspaceId,
              },
            },
            category: {
              connect: {
                id: categoryId,
              },
            },
            barcode: sku,
          },
        });
        return product;
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async updateProduct(
    dto: UpdateProductDTO,
    productId: string,
    workspaceId: string,
  ) {
    try {
      return this.db.$transaction(async (tx) => {
        await tx.product.findFirstOrThrow({
          where: {
            id: productId,
            workspaceId,
          },
        });
        const updatedProduct = await tx.product.update({
          where: {
            id: productId,
          },
          data: dto,
        });
        return updatedProduct;
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deleteProduct(productId: string, workspaceId: string) {
    try {
      return this.db.$transaction(async (tx) => {
        await tx.product.findFirstOrThrow({
          where: {
            id: productId,
            workspaceId,
          },
        });
        return await tx.product.delete({
          where: {
            id: productId,
          },
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProductById(productId: string, workspaceId: string) {
    try {
      const product = await this.db.product.findFirstOrThrow({
        where: {
          id: productId,
          workspaceId,
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              description: true,
            },
          },
        },
      });
      return product;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async searchProducts(query: string, workspaceId: string) {
    try {
      const trimmedQuery = query?.trim();
      if (!trimmedQuery) {
        return await this.getProducts(workspaceId);
      }

      const sanitizedTerms = trimmedQuery
        .replace(/[&|!():*]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
      const tsqueryFormatted =
        sanitizedTerms.length > 0
          ? sanitizedTerms.map((t) => `${t}:*`).join(' & ')
          : undefined;

      return await this.db.product.findMany({
        where: {
          workspaceId,
          OR: [
            ...(tsqueryFormatted
              ? [{ name: { search: tsqueryFormatted } }]
              : []),
            { name: { contains: trimmedQuery, mode: 'insensitive' as const } },
            { sku: { contains: trimmedQuery, mode: 'insensitive' as const } },
            {
              barcode: { contains: trimmedQuery, mode: 'insensitive' as const },
            },
            {
              category: {
                name: { contains: trimmedQuery, mode: 'insensitive' as const },
              },
            },
          ],
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              description: true,
            },
          },
        },
        orderBy: [{ isUp: 'desc' }, { isActive: 'desc' }],
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProducts(workspaceId: string) {
    try {
      return await this.db.product.findMany({
        where: {
          workspaceId,
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              description: true,
            },
          },
        },
        orderBy: [{ isUp: 'desc' }, { isActive: 'desc' }],
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProductsByCategory(categoryId: string, workspaceId: string) {
    try {
      return await this.db.product.findMany({
        where: {
          categoryId,
          workspaceId,
        },
        include: {
          category: {
            select: {
              name: true,
              icon: true,
              description: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async uploadProductImage(fileName: string, contentType?: string) {
    if (!fileName) {
      throw new BadRequestException('Parameter fileName wajib diisi!');
    }

    const uniqueFileName = `images/${Date.now()}-${fileName}`;
    const bucketName = this.configService.getOrThrow<string>('BUCKET_PRODUCT');

    const uploadURL = await this.storageService.generatePresignedUploadURL({
      bucketName: bucketName,
      fileName: uniqueFileName,
      contentType: contentType || 'application/octet-stream',
      expiresIn: 600,
    });

    return {
      success: true,
      uploadURL: uploadURL,
      fileKey: uniqueFileName,
    };
  }
}
