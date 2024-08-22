import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AccountCreatedEmailDto } from './dto/create-mail.dto';
import { MailResponse } from './interface';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPlainEmail(sendEmailDto: AccountCreatedEmailDto): Promise<MailResponse> {
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

  async sendPasswordResetEmail(resetPasswordRequestDto: ResetPasswordRequestDto) {
    const { email, name, url } = resetPasswordRequestDto;
    try {
      await this.mailerService.sendMail({
        to: email,
        bcc: process.env.EMAIL_USER,
        subject: 'Password Reset Request',
        template: './password-reset',
        context: {
          name,
          url,
        },
      });
      return { response: `Password reset email sent to ${email}` };
    } catch (e) {
      console.error('Error sending password reset email:', e);
      return { isError: true, response: 'Error sending password reset email' };
    }
  }

  async sendLoginAlertEmail(prop: {
    email: string;
    name: string;
    loginTime: string;
    ipAddress: string;
    resetLink: string;
  }) {
    const { email, ipAddress, loginTime, name, resetLink } = prop;
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
      },
    });
  }
}
