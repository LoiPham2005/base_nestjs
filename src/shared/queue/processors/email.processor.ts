// ============================================
// src/shared/queue/processors/email.processor.ts
// ============================================
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAMES } from '../../../common/constants/app.constant';
import { MailService } from '../../mail/mail.service';

@Processor(QUEUE_NAMES.EMAIL)
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private mailService: MailService) {}

  @Process('send-welcome-email')
  async handleWelcomeEmail(job: Job) {
    this.logger.log(`Processing welcome email job ${job.id}`);
    const { email, name } = job.data;

    try {
      await this.mailService.sendWelcomeEmail(email, name);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('send-verification-email')
  async handleVerificationEmail(job: Job) {
    this.logger.log(`Processing verification email job ${job.id}`);
    const { email, token } = job.data;

    try {
      await this.mailService.sendVerificationEmail(email, token);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`);
      throw error;
    }
  }

  @Process('send-password-reset-email')
  async handlePasswordResetEmail(job: Job) {
    this.logger.log(`Processing password reset email job ${job.id}`);
    const { email, token } = job.data;

    try {
      await this.mailService.sendPasswordResetEmail(email, token);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email: ${error.message}`);
      throw error;
    }
  }
}