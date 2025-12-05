// ============================================
// src/shared/mail/mail.service.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export interface IEmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: any;
  html?: string;
  text?: string;
  attachments?: any[];
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmail(options: IEmailOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Our Platform',
      template: 'welcome',
      context: {
        name,
        loginUrl: `${this.configService.get('FRONTEND_URL')}/login`,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      template: 'verify-email',
      context: {
        verificationUrl,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      template: 'reset-password',
      context: {
        resetUrl,
        expiryTime: '1 hour',
      },
    });
  }

  async sendPasswordChangedEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Password Changed Successfully',
      template: 'password-changed',
      context: {
        name,
        supportUrl: `${this.configService.get('FRONTEND_URL')}/support`,
      },
    });
  }

  async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Your OTP Code',
      template: 'otp',
      context: {
        otp,
        expiryTime: '5 minutes',
      },
    });
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject,
      template: 'notification',
      context: {
        subject,
        message,
      },
    });
  }

  async sendBulkEmail(
    emails: string[],
    subject: string,
    template: string,
    context: any,
  ): Promise<boolean> {
    const promises = emails.map((email) =>
      this.sendEmail({
        to: email,
        subject,
        template,
        context,
      }),
    );

    try {
      await Promise.all(promises);
      this.logger.log(`Bulk email sent to ${emails.length} recipients`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send bulk email: ${error.message}`);
      return false;
    }
  }
}
