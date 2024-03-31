import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.MAILER_USER!,
          pass: process.env.MAILER_PASS!,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
