// ============================================
// src/shared/storage/providers/local.provider.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageProvider } from '../storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalProvider.name);
  private uploadPath: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get('UPLOAD_PATH', './uploads');
    this.baseUrl = this.configService.get('BASE_URL', 'http://localhost:3000');
    
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, uploadPath?: string): Promise<string> {
    const filename = this.generateFilename(file.originalname);
    const dirPath = uploadPath 
      ? path.join(this.uploadPath, uploadPath)
      : this.uploadPath;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, filename);
    
    // Write file
    fs.writeFileSync(filePath, file.buffer);

    const relativePath = uploadPath ? `${uploadPath}/${filename}` : filename;
    const url = `${this.baseUrl}/uploads/${relativePath}`;
    
    this.logger.log(`File uploaded locally: ${url}`);
    return url;
  }

  async uploadBuffer(buffer: Buffer, filename: string, uploadPath?: string): Promise<string> {
    const generatedFilename = this.generateFilename(filename);
    const dirPath = uploadPath 
      ? path.join(this.uploadPath, uploadPath)
      : this.uploadPath;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, generatedFilename);
    fs.writeFileSync(filePath, buffer);

    const relativePath = uploadPath ? `${uploadPath}/${generatedFilename}` : generatedFilename;
    return `${this.baseUrl}/uploads/${relativePath}`;
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      const filename = this.extractFilenameFromUrl(fileUrl);
      const filePath = path.join(this.uploadPath, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`File deleted locally: ${filePath}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      return false;
    }
  }

  async getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string> {
    // For local storage, we return the same URL
    // In production, you might want to implement token-based access
    return fileUrl;
  }

  async exists(fileUrl: string): Promise<boolean> {
    try {
      const filename = this.extractFilenameFromUrl(fileUrl);
      const filePath = path.join(this.uploadPath, filename);
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  private generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4();
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    return `${sanitized}-${timestamp}-${uuid}${ext}`;
  }

  private extractFilenameFromUrl(url: string): string {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.replace('/uploads/', '');
  }
}