// ============================================
// src/common/pipes/file-validation.pipe.ts
// ============================================
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(file: Express.Multer.File) {
    if (!file && this.options.required) {
      throw new BadRequestException('File is required');
    }

    if (!file) {
      return file;
    }

    // Validate file size
    if (this.options.maxSize && file.size > this.options.maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.options.maxSize} bytes`,
      );
    }

    // Validate mime type
    if (
      this.options.allowedMimeTypes &&
      !this.options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }
}