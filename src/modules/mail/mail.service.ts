import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }

  async sendNewPasswordEmail(to: string, newPassword: string): Promise<void> {
    const subject = 'New Password';
    const text = `Your new password is: ${newPassword}. Please change it after login.`;
    await this.sendEmail(to, subject, text);
  }
}
