import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  LoginAlertEmail,
  MailResponse,
  ResetPasswordRequest,
  SendChangePasswordEmail,
  WelcomeEmail,
} from './interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(welcomeEmailDto: WelcomeEmail): Promise<MailResponse> {
    if (process.env.ENVIRONMENT !== 'prod') {
      return { isError: false, response: 'Email sending skipped in non-prod environment' };
    }
    const { email: to, name } = welcomeEmailDto;
    try {
      await this.mailerService.sendMail({
        to,
        bcc: process.env.EMAIL_USER,
        subject: 'Welcome to Review It!',
        template: './welcome',
        context: { name },
      });
      return { isError: false, response: `Email sent to ${to}` };
    } catch (e) {
      console.error('Error sending welcome email:', e);
      return {
        isError: true,
        errorDetails: e.message,
      };
    }
  }

  async sendPasswordResetEmail(prop: ResetPasswordRequest): Promise<MailResponse> {
    if (process.env.ENVIRONMENT !== 'prod') {
      return { isError: false, response: 'Email sending skipped in non-prod environment' };
    }
    const { email, name, url, device, ipAddress, time } = prop;
    try {
      await this.mailerService.sendMail({
        to: email,
        bcc: process.env.EMAIL_USER,
        subject: 'Password Reset Request',
        template: './password-reset',
        context: {
          name,
          url,
          time,
          ipAddress,
          device,
        },
      });
      return { isError: false, response: `Password reset email sent to ${email}` };
    } catch (e) {
      console.error('Error sending password reset email:', e);
      return {
        isError: true,
        errorDetails: e.message,
      };
    }
  }

  async sendLoginAlertEmail(prop: LoginAlertEmail): Promise<MailResponse> {
    if (process.env.ENVIRONMENT !== 'prod') {
      return { isError: false, response: 'Email sending skipped in non-prod environment' };
    }
    const { email, ipAddress, loginTime, name, resetLink, device } = prop;
    try {
      await this.mailerService.sendMail({
        bcc: process.env.EMAIL_USER,
        to: email,
        subject: 'Login Alert - Your Account',
        template: './login-alert',
        context: {
          name,
          loginTime,
          ipAddress,
          resetLink,
          device,
        },
      });
      return { isError: false, response: `Login alert email sent to ${email}` };
    } catch (e) {
      console.error('Error sending login alert email:', e);
      return {
        isError: true,
        errorDetails: e.message,
      };
    }
  }
  async sendChangePasswordAlertEmail(prop: SendChangePasswordEmail): Promise<MailResponse> {
    if (process.env.ENVIRONMENT !== 'prod') {
      return { isError: false, response: 'Email sending skipped in non-prod environment' };
    }
    const { email, ipAddress, name, time, device, url } = prop;
    try {
      await this.mailerService.sendMail({
        bcc: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Change Alert',
        template: './password-change-alert',
        context: {
          name,
          time,
          ipAddress,
          device,
          url,
        },
      });
      return { isError: false, response: `Password change alert email sent to ${email}` };
    } catch (e) {
      console.error('Error sending password change alert email:', e);
      return {
        isError: true,
        errorDetails: e.message,
      };
    }
  }
}
