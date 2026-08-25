import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface GeneratePresignedUploadURLOptions {
  bucketName: string;
  fileName: string;
  contentType?: string;
  expiresIn?: number;
}

export interface GeneratePresignedDownloadURLOptions {
  bucketName: string;
  fileName: string;
  expiresIn: number;
}

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const accessKey = this.configService.get<string>('S3_ROOT_USER');
    const secretKey = this.configService.get<string>('S3_ROOT_PASSWORD');

    if (!accessKey || !secretKey) {
      throw new Error(
        'The S3_ACCESS_KEY or S3_SECRET_KEY configuration has not been set in .env.',
      );
    }

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  private errorFormat(error: unknown, bucketName: string) {
    if (error instanceof Error) {
      if (error.name === 'NoSuchBucket') {
        throw new BadRequestException(
          `Bucket '${bucketName}' tidak ditemukan di S3.`,
        );
      }
      if (
        error.name === 'CredentialsError' ||
        error.name === 'InvalidAccessKeyId'
      ) {
        throw new InternalServerErrorException(
          'Konfigurasi kredensial AWS pada server bermasalah.',
        );
      }
    }
    throw new InternalServerErrorException(
      'Gagal menghasilkan URL upload. Silakan coba lagi nanti.',
    );
  }

  public async generatePresignedUploadURL(
    options: GeneratePresignedUploadURLOptions,
  ): Promise<string | undefined> {
    const { bucketName, fileName, contentType, expiresIn } = options;
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
      });
      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });
      return presignedUrl;
    } catch (error) {
      this.errorFormat(error, bucketName);
    }
  }

  public async generatePresignedDownloadURL(
    options: GeneratePresignedDownloadURLOptions,
  ): Promise<string | undefined> {
    const { bucketName, fileName, expiresIn } = options;
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });
      return presignedUrl;
    } catch (error) {
      this.errorFormat(error, bucketName);
    }
  }
}
