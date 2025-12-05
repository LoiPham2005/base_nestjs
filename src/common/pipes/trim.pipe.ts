// ============================================
// src/common/pipes/trim.pipe.ts
// ============================================
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any): any {
    if (Array.isArray(values)) {
      return values.map((value) => this.trim(value));
    }

    if (this.isObject(values)) {
      Object.keys(values).forEach((key) => {
        values[key] = this.trim(values[key]);
      });
      return values;
    }

    if (typeof values === 'string') {
      return values.trim();
    }

    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body' || type === 'query') {
      return this.trim(values);
    }
    return values;
  }
}