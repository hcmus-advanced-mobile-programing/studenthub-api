import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Message } from 'src/modules/message/message.entity';
import { MessageService } from 'src/modules/message/message.service';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';
import { User } from 'src/modules/user/user.entity';
import { FavoriteProject } from 'src/modules/favoriteProject/favoriteProject.entity';
import { CompanyProfileService } from 'src/modules/company/company.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Notification } from 'src/modules/notification/notification.entity';
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Message, Student, Company, FavoriteProject, User, Notification, Interview, MeetingRoom, Proposal])],
  providers: [ProjectService, MessageService, CompanyProfileService, NotificationService],
  controllers: [ProjectController],
})
export class ProjectModule {}
