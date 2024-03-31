import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  
}
