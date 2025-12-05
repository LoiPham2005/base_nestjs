// ============================================
// src/shared/storage/providers/s3.provider.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageProvider } from '../storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Provider implements IStorageProvider {
    private readonly logger = new Logger(S3Provider.name);
    private s3Client: S3Client;
    private bucket: string;

    constructor(private configService: ConfigService) {
        this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';
        const region = this.configService.get<string>('AWS_REGION') || '';
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID') || '';
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '';

        if (!this.bucket || !region || !accessKeyId || !secretAccessKey) {
            throw new Error('Missing AWS S3 configuration');
        }

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async upload(file: Express.Multer.File, path?: string): Promise<string> {
        const key = this.generateKey(file.originalname, path);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        await this.s3Client.send(command);

        const url = `https://${this.bucket}.s3.amazonaws.com/${key}`;
        this.logger.log(`File uploaded to S3: ${url}`);

        return url;
    }

    async uploadBuffer(buffer: Buffer, filename: string, path?: string): Promise<string> {
        const key = this.generateKey(filename, path);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ACL: 'public-read',
        });

        await this.s3Client.send(command);

        return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }

    async delete(fileUrl: string): Promise<boolean> {
        try {
            const key = this.extractKeyFromUrl(fileUrl);

            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            this.logger.log(`File deleted from S3: ${key}`);

            return true;
        } catch (error) {
            this.logger.error(`Failed to delete file from S3: ${error.message}`);
            return false;
        }
    }

    async getSignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
        const key = this.extractKeyFromUrl(fileUrl);

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    async exists(fileUrl: string): Promise<boolean> {
        try {
            const key = this.extractKeyFromUrl(fileUrl);

            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch {
            return false;
        }
    }

    private generateKey(filename: string, path?: string): string {
        const timestamp = Date.now();
        const uuid = uuidv4();
        const ext = filename.split('.').pop();
        const basePath = path || 'uploads';

        return `${basePath}/${timestamp}-${uuid}.${ext}`;
    }

    private extractKeyFromUrl(url: string): string {
        const urlObj = new URL(url);
        return urlObj.pathname.substring(1); // Remove leading slash
    }
}