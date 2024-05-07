import { Injectable, Logger } from '@nestjs/common';
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
import { User } from 'src/modules/user/user.entity';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventGateway } from 'src/modules/event/event.gateway';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';

@Injectable()
export class InterviewService {
  @WebSocketServer() private server: Server;
  private readonly logger = new Logger(InterviewService.name);
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly messageService: MessageService,
    @InjectRepository(MeetingRoom)
    private readonly meetingRoomRepository: Repository<MeetingRoom>,
    private readonly notificationService: NotificationService,
    private readonly meetingRoomService: MeetingRoomService,
    private eventGateway: EventGateway,
  ) {}

  async findAll(): Promise<Interview[]> {
    const interviews = await this.interviewRepository.find({});
    return interviews.filter((i) => i.deletedAt === null);
  }

  async findById(id: number): Promise<Interview> {
    return await this.interviewRepository.findOneBy({
      id,
    });
  }

  async create(interview: InterviewCreateDto): Promise<void> {
    if (!interview.expired_at) {
      interview.expired_at = interview.endTime;
    }

    const checkMeetingExist = await this.meetingRoomRepository.findOne({
      where: [{ meeting_room_code: interview.meeting_room_code }, { meeting_room_id: interview.meeting_room_id }],
    });

    if (checkMeetingExist) {
      if (checkMeetingExist.meeting_room_code === interview.meeting_room_code) {
        throw new Error('Meeting room code already exists' );
      } else {
        throw new Error('Meeting room id already exists');
      }
    }

    const meeting_room = await this.meetingRoomService.create({
      meeting_room_code: interview.meeting_room_code,
      meeting_room_id: interview.meeting_room_id,
      expired_at: interview.expired_at,
    });

    const newInterview = await this.interviewRepository.save({ ...interview, meetingRoomId: meeting_room.id });

    const message = await this.messageService.createMessageForNotis({
      senderId: interview.senderId,
      receiverId: interview.receiverId,
      projectId: interview.projectId,
      content: interview.content,
      interviewId: newInterview.id,
      messageFlag: MessageFlag.Interview,
    });

    const notificationId = await this.notificationService.createNotification({
      senderId: interview.senderId,
      receiverId: interview.receiverId,
      messageId: message,
      content: 'Interview created',
      notifyFlag: NotifyFlag.Unread,
      typeNotifyFlag: TypeNotifyFlag.Interview,
      title: interview.title,
      proposalId: null,
    });

    await this.eventGateway.sendNotification({
      notificationId: notificationId as string,
      receiverId: interview.receiverId as string,
      senderId: interview.senderId as string,
      projectId: interview.projectId as string
    });
  }

  async update(id: number, interview: InterviewUpdateDto): Promise<void> {
    const existingProject = await this.interviewRepository.findOne({ where: { id } });
    if (!existingProject) {
      throw new Error('Interview not found');
    }

    const message = await this.messageRepository.findOneBy({ interviewId: id });
    if (!message) {
      throw new Error('Related message not found');
    }

    const sender = await this.userRepository.findOneBy({ id: message.senderId });
    const receiver = await this.userRepository.findOneBy({ id: message.receiverId });

    const notificationId = await this.notificationService.createNotification({
      senderId: sender.id,
      receiverId: receiver.id,
      messageId: message.id,
      content: `Interview updated`,
      notifyFlag: NotifyFlag.Unread,
      typeNotifyFlag: TypeNotifyFlag.Interview,
      title: `Interview updated from ${sender.fullname}`,
      proposalId: null,
    });

    await this.interviewRepository.update(id, interview);
    await this.eventGateway.sendNotification({
      notificationId: notificationId as string,
      receiverId: message.receiverId as string,
      senderId: message.senderId as string,
      projectId: message.projectId as string
    });
  }

  async delete(id: number): Promise<void> {
    if (!this.interviewRepository.findOne({ where: { id } })) {
      throw new Error('Interview not found');
    }
    await this.interviewRepository.update(id, { deletedAt: new Date() });
  }

  async disable(id: number): Promise<void> {
    const existingInterview = await this.interviewRepository.findOne({ where: { id } });
    if (!existingInterview) {
      throw new Error('Interview not found');
    }

    const message = await this.messageRepository.findOneBy({ interviewId: id });
    if (!message) {
      throw new Error('Related message not found');
    }

    const sender = await this.userRepository.findOneBy({ id: message.senderId });
    const receiver = await this.userRepository.findOneBy({ id: message.receiverId });
    const notificationId = await this.notificationService.createNotification({
      senderId: sender.id,
      receiverId: receiver.id,
      messageId: message.id,
      content: `Interview cancelled`,
      notifyFlag: NotifyFlag.Unread,
      typeNotifyFlag: TypeNotifyFlag.Interview,
      title: `Interview cancelled from ${sender.fullname}`,
      proposalId: null,
    });

    if (existingInterview.disableFlag === DisableFlag.Disable) {
      throw new Error('Interview already disabled');
    }
    await this.interviewRepository.update(id, {disableFlag: DisableFlag.Disable });

    await this.eventGateway.sendNotification({
      notificationId: notificationId as string,
      receiverId: message.receiverId as string,
      senderId: message.senderId as string,
      projectId: message.projectId as string
    });
  }
}
