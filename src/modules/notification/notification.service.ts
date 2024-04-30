import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notification/notification.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notification/dto/notification-create.dto';
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';

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
    console.log(id);
    console.log(receiverId);
    if (receiverId != id) {
      throw new Error('You are not authorized to view this notification');
    }
    const notifications =  await this.notificationRepository.find({
      where: { receiverId },
      relations: ['message', 'sender', 'receiver'],
    });

    const notificationsWithoutPassword = await Promise.all(notifications.map(async notification => {
      const { sender, receiver, ...rest } = notification;
      const sanitizedSender = { ...sender };
      const sanitizedReceiver = { ...receiver };
      let interview : any;
      let meetingRoom : any;
      delete sanitizedSender.password;
      delete sanitizedReceiver.password;
      if (notification.message.interviewId != null){
        interview = await this.interviewRepository.findOneBy({id: notification.message.interviewId});
        meetingRoom = await this.meetingRoomRepository.findOneBy({id: interview.meetingRoomId});
      }
      else{
        interview = meetingRoom = null;
      }
      
      return { ...rest, sender: sanitizedSender, receiver: sanitizedReceiver, interview: interview, meetingRoom: meetingRoom };
    }));

    return notificationsWithoutPassword;
  }

  async createNotification(notificationDto: CreateNotificationDto): Promise<number | string | boolean> {
    const notification = this.notificationRepository.save(notificationDto);
    if (notification && (await notification).id)
      return (await notification).id;
    else return false;
  }

  async findOneByReceiverId(receiverId: string | number, messageId: string | number): Promise<any> {
    const notification =  await this.notificationRepository.findOne({
      where: { messageId: messageId, receiverId: receiverId },
      relations: ['message', 'sender', 'receiver'],
    });

    const notificationWithoutPassword = async () => {
      const { sender, receiver, ...rest } = notification;
      const sanitizedSender = { ...sender };
      const sanitizedReceiver = { ...receiver };
      let interview : any;
      let meetingRoom : any;
      delete sanitizedSender.password;
      delete sanitizedReceiver.password;
      if (notification.message.interviewId != null){
        interview = await this.interviewRepository.findOneBy({ id: notification.message.interviewId });
        meetingRoom = await this.meetingRoomRepository.findOneBy({ id: interview.meetingRoomId });
      }
      else{
        interview = meetingRoom = null;
      }
      
      return { ...rest, sender: sanitizedSender, receiver: sanitizedReceiver, interview, meetingRoom };
    };

    return notificationWithoutPassword();
  }
}
