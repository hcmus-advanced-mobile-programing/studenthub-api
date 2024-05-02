import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DisableFlag, MessageFlag, NotifyFlag, TypeNotifyFlag } from 'src/common/common.enum';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewUpdateDto } from 'src/modules/interview/dto/interview-update.dto';
import { Interview } from 'src/modules/interview/interview.entity';
import { MessageService } from 'src/modules/message/message.service';
import { Repository } from 'typeorm';
import { Message } from 'src/modules/message/message.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { MeetingRoomService } from 'src/modules/meeting-room/meeting-room.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly projectRepository: Repository<Interview>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly meetingRoomService: MeetingRoomService,
  ) {}

  async findAll(): Promise<Interview[]> {
    const interviews = await this.projectRepository.find({});
    return interviews.filter((i) => i.deletedAt === null);
  }

  async findById(id: number): Promise<Interview> {
    return await this.projectRepository.findOneBy({
      id,
    });
  }

  async create(interview: InterviewCreateDto): Promise<Interview> {
    if (!interview.expired_at) {
      interview.expired_at = interview.endTime;
    }

    const meeting_room = await this.meetingRoomService.create({
      meeting_room_code: interview.meeting_room_code,
      meeting_room_id: interview.meeting_room_id,
      expired_at: interview.expired_at,
    });

    const newInterview = await this.projectRepository.save({...interview, meetingRoomId: meeting_room.id});

    await this.messageService.createMessage({
      senderId: interview.senderId,
      receiverId: interview.receiverId,
      projectId: interview.projectId,
      content: interview.content,
      interviewId: newInterview.id,
      messageFlag: MessageFlag.Interview,
    });

    const message = await this.messageRepository.findOneBy({interviewId: newInterview.id});

    await this.notificationService.createNotification({
      senderId: interview.senderId,
      receiverId: interview.receiverId,
      messageId: message.id,
      content: 'Interview created',
      notifyFlag: NotifyFlag.Unread,
      typeNotifyFlag: TypeNotifyFlag.Interview,
      title: interview.title,
    });

    return newInterview;
  }

  async update(id: number, interview: InterviewUpdateDto): Promise<void> {
    if (!this.projectRepository.findOne({ where: { id } })) {
      throw new Error('Interview not found');
    }
    await this.projectRepository.update(id, interview);
  }

  async delete(id: number): Promise<void> {
    if (!this.projectRepository.findOne({ where: { id } })) {
      throw new Error('Interview not found');
    }
    await this.projectRepository.update(id, { deletedAt: new Date() });
  }

  async disable(id: number): Promise<void> {
    const interview = await this.projectRepository.findOne({ where: { id } });
    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.disableFlag === DisableFlag.Disable) {
      throw new Error('Interview already disabled');
    }
    await this.projectRepository.save({ ...interview, disableFlag: DisableFlag.Disable });
  }
}
