// ============================================
// src/shared/storage/storage.service.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Provider } from './providers/s3.provider';
import { LocalProvider } from './providers/local.provider';

export interface IStorageProvider {
  upload(file: Express.Multer.File, path?: string): Promise<string>;
  uploadBuffer(buffer: Buffer, filename: string, path?: string): Promise<string>;
  delete(fileUrl: string): Promise<boolean>;
  getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string>;
  exists(fileUrl: string): Promise<boolean>;
}

export interface IUploadResult {
  url: string;
  key: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private provider: IStorageProvider;

  constructor(
    private configService: ConfigService,
    private s3Provider: S3Provider,
    private localProvider: LocalProvider,
  ) {
    const storageType = this.configService.get('STORAGE_TYPE', 'local');
    this.provider = storageType === 's3' ? this.s3Provider : this.localProvider;
    this.logger.log(`Using ${storageType} storage provider`);
  }

  async uploadFile(
    file: Express.Multer.File,
    path?: string,
  ): Promise<IUploadResult> {
    try {
      const url = await this.provider.upload(file, path);
      
      return {
        url,
        key: this.extractKeyFromUrl(url),
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw error;
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
    path?: string,
  ): Promise<IUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, path));
    return Promise.all(uploadPromises);
  }

  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    path?: string,
  ): Promise<string> {
    try {
      return await this.provider.uploadBuffer(buffer, filename, path);
    } catch (error) {
      this.logger.error(`Failed to upload buffer: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      return await this.provider.delete(fileUrl);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      return false;
    }
  }

  async deleteFiles(fileUrls: string[]): Promise<boolean[]> {
    const deletePromises = fileUrls.map((url) => this.deleteFile(url));
    return Promise.all(deletePromises);
  }

  async getSignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
    try {
      return await this.provider.getSignedUrl(fileUrl, expiresIn);
    } catch (error) {
      this.logger.error(`Failed to get signed URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      return await this.provider.exists(fileUrl);
    } catch (error) {
      this.logger.error(`Failed to check file existence: ${error.message}`);
      return false;
    }
  }

  private extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }
}