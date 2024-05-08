import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/modules/company/company.entity';
import { Education } from 'src/modules/education/education.entity';
import { EventModule } from 'src/modules/event/event.module';
import { Experience } from 'src/modules/experience/experience.entity';
import { GCSService } from 'src/modules/gcs/gcs.service';
import { Interview } from 'src/modules/interview/interview.entity';
import { Language } from 'src/modules/language/language.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';
import { Notification } from 'src/modules/notification/notification.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Project } from 'src/modules/project/project.entity';
import { ProposalController } from 'src/modules/proposal/proposal.controller';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { Student } from 'src/modules/student/student.entity';
import { StudentProfileService } from 'src/modules/student/student.service';
import { TechStack } from 'src/modules/techStack/techStack.entity';
import { User } from 'src/modules/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proposal,
      Project,
      Student,
      Company,
      User,
      Notification,
      Interview,
      MeetingRoom,
      TechStack,
      SkillSet,
      Education,
      Experience,
      Language,
    ]),
    ConfigModule,
    EventModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalService, NotificationService, StudentProfileService, GCSService],
  exports: [ProposalService],
})
export class ProposalModule {}
