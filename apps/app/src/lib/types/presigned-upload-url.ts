export interface PresignedUploadURL {
  success: boolean;
  uploadURL: string;
  fileKey: string;
  publicUrl?: string;
  bucket?: string;
}
