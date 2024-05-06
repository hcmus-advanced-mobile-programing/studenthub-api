import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';
import { Project } from 'src/modules/project/project.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Notification } from 'src/modules/notification/notification.entity';
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';
import { EventModule } from 'src/modules/event/event.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Student, Company, Project, Notification, Interview, MeetingRoom]), ConfigModule, EventModule],
  providers: [MessageService, NotificationService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
