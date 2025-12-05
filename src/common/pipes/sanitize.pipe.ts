// ============================================
// src/common/pipes/sanitize.pipe.ts
// ============================================
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import xss from 'xss';

@Injectable()
export class SanitizePipe implements PipeTransform {
  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private sanitize(values: any): any {
    if (Array.isArray(values)) {
      return values.map((value) => this.sanitize(value));
    }

    if (this.isObject(values)) {
      Object.keys(values).forEach((key) => {
        values[key] = this.sanitize(values[key]);
      });
      return values;
    }

    if (typeof values === 'string') {
      return xss(values);
    }

    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body' || type === 'query') {
      return this.sanitize(values);
    }
    return values;
  }
}