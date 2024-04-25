import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/modules/interview/interview.entity';
import { MessageModule } from 'src/modules/message/message.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Notification } from 'src/modules/notification/notification.entity';
import { Message } from 'src/modules/message/message.entity';
import { NotificationService } from 'src/modules/notification/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, Message, Notification]), MessageModule, AuthModule],
  controllers: [InterviewController],
  providers: [InterviewService, NotificationService],
})
export class InterviewModule {}