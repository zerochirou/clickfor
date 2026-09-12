import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetWorkspacePresignedUrlDTO {
  @IsString({ message: 'fileName harus berupa string' })
  @IsNotEmpty({ message: 'fileName wajib diisi' })
  fileName: string;

  @IsString({ message: 'contentType harus berupa string' })
  @IsOptional()
  contentType?: string;
}
