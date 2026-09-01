import { supabaseAdmin } from '../config/supabase.config';
import { Result } from '../utils/result.util';
import { logger } from '../utils/logger.util';

export type StorageBucketName =
  | 'payment-proofs'
  | 'product-assets'
  | 'withdrawal-proofs'
  | 'avatars';

export class StorageService {
  /**
   * Upload file buffer to Supabase Storage bucket.
   */
  static async uploadFile(
    bucket: StorageBucketName,
    filePath: string,
    fileBuffer: Buffer,
    contentType: string
  ) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        logger.error('[SupabaseStorage Upload Error]:', error);
        return Result.fail(`Gagal mengunggah berkas: ${error.message}`, 500);
      }

      // If public bucket, get public URL
      if (bucket === 'product-assets' || bucket === 'avatars') {
        const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
        return Result.ok({ path: data.path, publicUrl: urlData.publicUrl });
      }

      // For private buckets, generate signed URL valid for 24 hours
      const { data: signedData, error: signError } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60 * 24);

      if (signError) {
        return Result.fail(`Gagal membuat URL aman: ${signError.message}`, 500);
      }

      return Result.ok({ path: data.path, signedUrl: signedData.signedUrl });
    } catch (err: any) {
      logger.error('[StorageService Exception]:', err);
      return Result.fail('Terjadi kegagalan saat menghubungi storage server.', 500);
    }
  }

  /**
   * Get signed URL for private bucket asset.
   */
  static async getSignedUrl(bucket: StorageBucketName, filePath: string, expiresInSeconds = 3600) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      return Result.fail(`Gagal mengambil URL berkas: ${error.message}`, 404);
    }

    return Result.ok(data.signedUrl);
  }
}
