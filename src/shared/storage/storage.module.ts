// ============================================
// src/shared/storage/storage.module.ts
// ============================================
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { S3Provider } from './providers/s3.provider';
import { LocalProvider } from './providers/local.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [StorageService, S3Provider, LocalProvider],
  exports: [StorageService],
})
export class StorageModule {}