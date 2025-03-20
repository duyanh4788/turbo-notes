import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { config } from 'packages/config';
import { parse } from 'path';
import { FileGcs } from 'packages/interface/noteDetails.interface';
import { FLODER_GCS } from 'packages/common/constant';

@Injectable()
export class GCStorageService {
  private bucket: Bucket;

  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      projectId: config.GCS.PROJECT_ID,
      keyFilename: config.GCS.KEY_FILE_NAME,
    });
    this.bucket = this.storage.bucket(config.GCS.BUCKET);
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination += '/';
    return escDestination;
  }

  private setFilename(uploadedFile: FileGcs): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  async uploadFile(uploadedFile: FileGcs): Promise<any> {
    const fileName =
      this.setDestination(FLODER_GCS) + this.setFilename(uploadedFile);
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
    return {
      ...file.metadata,
      name: fileName,
      publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
    };
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.bucket.file(`${FLODER_GCS}/${fileName}`);
    try {
      await file.delete();
    } catch (error) {
      Logger.error(error?.message);
    }
  }

  async readFile(fileName: string): Promise<any> {
    const file = this.bucket.file(`${FLODER_GCS}/${fileName}`);
    return file;
  }
}
