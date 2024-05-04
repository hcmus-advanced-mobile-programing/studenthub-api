import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalController } from 'src/modules/proposal/proposal.controller';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { Project } from 'src/modules/project/project.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Notification } from 'src/modules/notification/notification.entity';
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, Project, Notification, Interview, MeetingRoom]), ConfigModule],
  controllers: [ProposalController],
  providers: [ProposalService, NotificationService],
  exports: [ProposalService],
})
export class ProposalModule {}
