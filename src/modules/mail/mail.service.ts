import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/modules/user/user.entity';

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

  async sendUserConfirmation(user: User, token: string) {
    const url = `${process.env.URL}/api/auth/confirm/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Verify a new account',
      text: `Please click below to confirm your email. \n${url}\nIf you did not request this email you can safely ignore it.`
    });
  }
}