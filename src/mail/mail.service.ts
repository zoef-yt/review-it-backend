import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { MailResponse } from './interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPlainEmail(sendEmailDto: SendEmail): Promise<MailResponse> {
    const { email: to, name } = sendEmailDto;
    try {
      await this.mailerService.sendMail({
        to,
        bcc: process.env.EMAIL_USER,
        subject: 'Welcome to Review It!',
        template: './welcome',
        context: {
          name,
        },
      });
      return { response: `Email sent to ${to}` };
    } catch (e) {
      console.error(e);
      if (e.response && e.response.includes('550')) {
        return {
          isError: true,
          response: `Failed to send email: ${e.response}`,
        };
      }
      return { isError: true, response: 'Error sending email' };
    }
  }

  async sendPasswordResetEmail(prop: ResetPasswordRequest) {
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
      return { response: `Password reset email sent to ${email}` };
    } catch (e) {
      console.error('Error sending password reset email:', e);
      return { isError: true, response: 'Error sending password reset email' };
    }
  }
  async sendLoginAlertEmail(prop: LoginAlertEmail) {
    const { email, ipAddress, loginTime, name, resetLink, device } = prop;
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
  }
}

interface SendEmail {
  email: string;
  name: string;
}

interface ResetPasswordRequest {
  email: string;
  name: string;
  url: string;
  time: string;
  ipAddress: string;
  device: string;
}

interface LoginAlertEmail {
  email: string;
  name: string;
  loginTime: string;
  ipAddress: string;
  resetLink: string;
  device: string;
}
