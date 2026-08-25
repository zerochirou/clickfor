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

  public async updateProduct(dto: UpdateProductDTO, productId: string) {
    try {
      return this.db.$transaction(async (tx) => {
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

  public async deleteProduct(productId: string) {
    try {
      return await this.db.product.delete({
        where: {
          id: productId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProductById(productId: string) {
    try {
      const product = await this.db.product.findFirstOrThrow({
        where: {
          id: productId,
        },
      });
      return product;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async searchProducts(query: string) {
    try {
      return await this.db.product.findMany({
        where: {
          name: {
            search: query,
          },
        },
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
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProductsByCategory(categoryId: string) {
    try {
      return await this.db.product.findMany({
        where: {
          categoryId,
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
