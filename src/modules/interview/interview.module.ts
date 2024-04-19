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
import { EventGateway } from 'src/modules/event/event.gateway';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';
import { Project } from 'src/modules/project/project.entity';
import { MailService } from 'src/modules/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, Message, Notification, User, Student, Company, Project]), MessageModule, AuthModule],
  controllers: [InterviewController],
  providers: [InterviewService, NotificationService, EventGateway, JwtService, UserService, MailService],
})
export class InterviewModule {}
