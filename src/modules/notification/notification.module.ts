import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notification/notification.entity';
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Interview, MeetingRoom])
  ],
  providers: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
