// ============================================
// src/shared/queue/queue.service.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job, JobOptions, JobStatus } from 'bull';
import { QUEUE_NAMES } from '../../common/constants/app.constant';

export interface IQueueJob {
    name: string;
    data: any;
    options?: JobOptions;
}

@Injectable()
export class QueueService {
    private readonly logger = new Logger(QueueService.name);

    constructor(
        @InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue,
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private notificationQueue: Queue,
        @InjectQueue(QUEUE_NAMES.FILE_PROCESSING) private fileQueue: Queue,
        @InjectQueue(QUEUE_NAMES.DATA_EXPORT) private exportQueue: Queue,
    ) { }

    // Email Queue Methods
    async addEmailJob(jobName: string, data: any, options?: JobOptions): Promise<Job> {
        this.logger.log(`Adding email job: ${jobName}`);
        return this.emailQueue.add(jobName, data, options);
    }

    async sendWelcomeEmail(email: string, name: string): Promise<Job> {
        return this.addEmailJob('send-welcome-email', { email, name });
    }

    async sendVerificationEmail(email: string, token: string): Promise<Job> {
        return this.addEmailJob('send-verification-email', { email, token });
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<Job> {
        return this.addEmailJob('send-password-reset-email', { email, token });
    }

    // Notification Queue Methods
    async addNotificationJob(jobName: string, data: any, options?: JobOptions): Promise<Job> {
        this.logger.log(`Adding notification job: ${jobName}`);
        return this.notificationQueue.add(jobName, data, options);
    }

    async sendPushNotification(userId: string, message: string): Promise<Job> {
        return this.addNotificationJob('send-push-notification', { userId, message });
    }

    async sendSMSNotification(phone: string, message: string): Promise<Job> {
        return this.addNotificationJob('send-sms-notification', { phone, message });
    }

    // File Processing Queue Methods
    async addFileProcessingJob(jobName: string, data: any, options?: JobOptions): Promise<Job> {
        this.logger.log(`Adding file processing job: ${jobName}`);
        return this.fileQueue.add(jobName, data, options);
    }

    async processImage(fileUrl: string, operations: any): Promise<Job> {
        return this.addFileProcessingJob('process-image', { fileUrl, operations });
    }

    async generateThumbnail(fileUrl: string, sizes: number[]): Promise<Job> {
        return this.addFileProcessingJob('generate-thumbnail', { fileUrl, sizes });
    }

    async processVideo(fileUrl: string, options: any): Promise<Job> {
        return this.addFileProcessingJob('process-video', { fileUrl, options });
    }

    // Data Export Queue Methods
    async addExportJob(jobName: string, data: any, options?: JobOptions): Promise<Job> {
        this.logger.log(`Adding export job: ${jobName}`);
        return this.exportQueue.add(jobName, data, options);
    }

    async exportToCsv(userId: string, query: any): Promise<Job> {
        return this.addExportJob('export-to-csv', { userId, query });
    }

    async exportToPdf(userId: string, data: any): Promise<Job> {
        return this.addExportJob('export-to-pdf', { userId, data });
    }

    // Queue Management Methods
    async getJob(queueName: string, jobId: string): Promise<Job | null> {
        const queue = this.getQueueByName(queueName);
        return queue?.getJob(jobId) || null;
    }

    async getJobs(queueName: string, types: JobStatus[]): Promise<Job[]> {
        const queue = this.getQueueByName(queueName);
        return queue?.getJobs(types) || [];
    }

    async getJobCounts(queueName: string): Promise<any> {
        const queue = this.getQueueByName(queueName);
        return queue?.getJobCounts();
    }

    async pauseQueue(queueName: string): Promise<void> {
        const queue = this.getQueueByName(queueName);
        await queue?.pause();
        this.logger.log(`Queue ${queueName} paused`);
    }

    async resumeQueue(queueName: string): Promise<void> {
        const queue = this.getQueueByName(queueName);
        await queue?.resume();
        this.logger.log(`Queue ${queueName} resumed`);
    }

    async cleanQueue(queueName: string, grace: number = 0): Promise<void> {
        const queue = this.getQueueByName(queueName);
        await queue?.clean(grace, 'completed');
        await queue?.clean(grace, 'failed');
        this.logger.log(`Queue ${queueName} cleaned`);
    }

    async emptyQueue(queueName: string): Promise<void> {
        const queue = this.getQueueByName(queueName);
        await queue?.empty();
        this.logger.log(`Queue ${queueName} emptied`);
    }

    private getQueueByName(queueName: string): Queue | null {
        switch (queueName) {
            case QUEUE_NAMES.EMAIL:
                return this.emailQueue;
            case QUEUE_NAMES.NOTIFICATION:
                return this.notificationQueue;
            case QUEUE_NAMES.FILE_PROCESSING:
                return this.fileQueue;
            case QUEUE_NAMES.DATA_EXPORT:
                return this.exportQueue;
            default:
                return null;
        }
    }
}