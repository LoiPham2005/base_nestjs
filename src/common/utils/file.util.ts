// ============================================
// src/common/utils/file.util.ts
// ============================================
import * as path from 'path';
import * as fs from 'fs';
import { StringUtil } from './string.util';

export class FileUtil {
  /**
   * Get file extension
   */
  static getExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  /**
   * Get filename without extension
   */
  static getNameWithoutExtension(filename: string): string {
    return path.parse(filename).name;
  }

  /**
   * Generate unique filename
   */
  static generateUniqueFilename(originalName: string): string {
    const ext = this.getExtension(originalName);
    const name = this.getNameWithoutExtension(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${StringUtil.slugify(name)}-${timestamp}-${random}${ext}`;
  }

  /**
   * Format file size
   */
  static formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Check if file exists
   */
  static exists(filepath: string): boolean {
    return fs.existsSync(filepath);
  }

  /**
   * Create directory if not exists
   */
  static createDirectory(dirpath: string): void {
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath, { recursive: true });
    }
  }

  /**
   * Delete file
   */
  static deleteFile(filepath: string): void {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}