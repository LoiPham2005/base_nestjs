// ============================================
// src/shared/queue/processors/notification.processor.ts
// ============================================
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAMES } from '../../../common/constants/app.constant';

@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process('send-push-notification')
  async handlePushNotification(job: Job) {
    this.logger.log(`Processing push notification job ${job.id}`);
    const { userId, message } = job.data;

    try {
      // Implement your push notification logic here
      // Example: await this.fcmService.sendNotification(userId, message);
      this.logger.log(`Push notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      throw error;
    }
  }

  @Process('send-sms-notification')
  async handleSMSNotification(job: Job) {
    this.logger.log(`Processing SMS notification job ${job.id}`);
    const { phone, message } = job.data;

    try {
      // Implement your SMS logic here
      // Example: await this.twilioService.sendSMS(phone, message);
      this.logger.log(`SMS sent to ${phone}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      throw error;
    }
  }
}