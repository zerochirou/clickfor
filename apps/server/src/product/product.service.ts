import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      const category = await this.db.productCategory.findFirstOrThrow({
        where: {
          id: categoryId,
          workspaceId,
        },
      });
      const sku = generateSKU({ category: category.name });
      return await this.db.product.create({
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
      const bucketName =
        this.configService.get<string>('BUCKET_PRODUCT') || 'products';
      const existingProduct = await this.db.product.findFirstOrThrow({
        where: {
          id: productId,
          workspaceId,
        },
      });
      if (!existingProduct) {
        throw new NotFoundException(
          `Product with ID ${workspaceId} not found.`,
        );
      }
      if (
        dto.image &&
        existingProduct.image &&
        dto.image !== existingProduct.image
      ) {
        await this.storageService.deleteObject(
          existingProduct.image,
          bucketName,
        );
      }

      return await this.db.product.update({
        where: {
          id: productId,
        },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async deleteProduct(productId: string, workspaceId: string) {
    try {
      await this.db.product.findFirstOrThrow({
        where: {
          id: productId,
          workspaceId,
        },
      });
      return await this.db.product.delete({
        where: {
          id: productId,
        },
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

  public async searchProducts(
    query: string,
    workspaceId: string,
    page = 1,
    limit = 10,
  ) {
    try {
      const trimmedQuery = query?.trim();
      if (!trimmedQuery) {
        return await this.getProducts(workspaceId, page, limit);
      }

      const sanitizedTerms = trimmedQuery
        .replace(/[&|!():*]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
      const tsqueryFormatted =
        sanitizedTerms.length > 0
          ? sanitizedTerms.map((t) => `${t}:*`).join(' & ')
          : undefined;

      const where = {
        workspaceId,
        OR: [
          ...(tsqueryFormatted ? [{ name: { search: tsqueryFormatted } }] : []),
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
      };

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.db.product.findMany({
          where,
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
          skip,
          take: limit,
        }),
        this.db.product.count({ where }),
      ]);

      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async getProducts(workspaceId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.db.product.findMany({
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
          skip,
          take: limit,
        }),
        this.db.product.count({ where: { workspaceId } }),
      ]);
      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
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

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFileName = `images/${Date.now()}-${cleanFileName}`;
    const bucketName =
      this.configService.get<string>('BUCKET_PRODUCT') || 'products';

    const uploadURL = await this.storageService.generatePresignedUploadURL({
      bucketName: bucketName,
      fileName: uniqueFileName,
      contentType: contentType || 'image/webp',
      expiresIn: 600,
    });

    return {
      success: true,
      uploadURL: uploadURL,
      fileKey: uniqueFileName,
      bucket: bucketName,
    };
  }
}
