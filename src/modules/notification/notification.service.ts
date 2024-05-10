import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notification/notification.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notification/dto/notification-create.dto';
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';
import { NotifyFlag } from 'src/common/common.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByReceiverId(receiverId: string | number): Promise<any[]> {
    const { id } = this.httpContext.getUser();

    if (receiverId != id) {
      throw new Error('You are not authorized to view this notification');
    }
    const notifications = await this.notificationRepository.find({
      where: { receiverId },
      relations: [
        'message',
        'sender',
        'receiver',
        'proposal',
        'proposal.project',
        'message.interview',
        'message.interview.meetingRoom',
      ],
      select: {
        sender: {
          id: true,
          fullname: true,
          email: true,
        },
        receiver: {
          id: true,
          fullname: true,
          email: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return notifications;
  }

  async createNotification(notificationDto: CreateNotificationDto): Promise<number | string | boolean> {
    const notification = this.notificationRepository.save(notificationDto);
    if (notification && (await notification).id) return (await notification).id;
    else return false;
  }

  async findOneById(id: string | number): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['message', 'sender', 'receiver', 'proposal', 'message.interview', 'message.interview.meetingRoom'],
      select: {
        sender: {
          id: true,
          fullname: true,
          email: true,
        },
        receiver: {
          id: true,
          fullname: true,
          email: true,
        },
      },
    });

    return notification;
  }

  async findOneByReceiverId(receiverId: string | number, messageId: string | number): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: { messageId: messageId, receiverId: receiverId },
      relations: ['message', 'sender', 'receiver', 'proposal', 'message.interview', 'message.interview.meetingRoom'],
      select: {
        sender: {
          id: true,
          fullname: true,
          email: true,
        },
        receiver: {
          id: true,
          fullname: true,
          email: true,
        },
      },
    });

    return notification;
  }

  async findOneByContent(receiverId: string | number, messageId: string | number, content: string): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: { messageId: messageId, receiverId: receiverId, content: content },
      relations: ['message', 'sender', 'receiver', 'proposal', 'message.interview', 'message.interview.meetingRoom'],
      select: {
        sender: {
          id: true,
          fullname: true,
          email: true,
        },
        receiver: {
          id: true,
          fullname: true,
          email: true,
        },
      },
    });

    return notification;
  }

  async readNotification(id: number | string): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.notifyFlag === NotifyFlag.Unread) {
      throw new Error('Interview already read');
    }
    await this.notificationRepository.update(id, { notifyFlag: NotifyFlag.Read });
  }
}
