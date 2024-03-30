import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { reject } from 'lodash';

const storage: Storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});
@Injectable()
export class GCSService {
  constructor() {}

  uploadFile(file: Express.Multer.File, path: string) {
    try {
      const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
      const filename = `${path}/${Date.now().toString()}-${file.originalname}`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err: any) => {
        reject(err);
      });
      blobStream.on('finish', () => {});
      blobStream.end(file.buffer);
      return filename;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFile(fileName: string) {
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 DAYS
    };

    // Get a v4 signed URL for reading the file
    const [url] = await storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME).file(fileName).getSignedUrl(options);
    return url;
  }

  async deleteFile(fileName: string) {
    await storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME).file(fileName).delete();
  }
}
