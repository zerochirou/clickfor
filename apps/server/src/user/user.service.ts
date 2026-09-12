import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { StorageService } from 'src/storage/storage.service';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

@Injectable()
export class UserService {
  constructor(
    private db: DbService,
    private configService: ConfigService,
    private storageService: StorageService,
  ) {}

  public async getAvatarPresignedUploadUrl(
    userId: string,
    fileName: string,
    contentType?: string,
  ) {
    if (!fileName) {
      throw new BadRequestException('Parameter fileName wajib diisi!');
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFileName = `avatars/${userId}-${Date.now()}-${cleanFileName}`;

    const bucketName =
      this.configService.get<string>('BUCKET_AVATAR') ||
      this.configService.get<string>('BUCKET_PRODUCT') ||
      'products';

    const uploadURL = await this.storageService.generatePresignedUploadURL({
      bucketName: bucketName,
      fileName: uniqueFileName,
      contentType: contentType || 'image/jpeg',
      expiresIn: 600,
    });

    const s3Endpoint =
      this.configService.get<string>('S3_ENDPOINT') || 'http://localhost:9000';
    const publicUrl = `${s3Endpoint}/${bucketName}/${uniqueFileName}`;

    return {
      success: true,
      uploadURL: uploadURL,
      fileKey: uniqueFileName,
      publicUrl: publicUrl,
      bucket: bucketName,
    };
  }

  public async getUserProfile(userId: string) {
    try {
      const user = await this.db.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          accounts: {
            select: {
              providerId: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              workspaces: true,
              workspaceMembers: true,
              sessions: true,
            },
          },
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accounts: user.accounts,
        stats: {
          ownedWorkspaces: user._count.workspaces,
          memberWorkspaces: user._count.workspaceMembers,
          activeSessions: user._count.sessions,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
