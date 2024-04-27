import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notification/notification.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notification/dto/notification-create.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByReceiverId(receiverId: string | number): Promise<Notification[]> {
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

    const notificationsWithoutPassword = notifications.map(notification => {
      const { sender, receiver, ...rest } = notification;
      const sanitizedSender = { ...sender };
      const sanitizedReceiver = { ...receiver };
      delete sanitizedSender.password;
      delete sanitizedReceiver.password;
      return { ...rest, sender: sanitizedSender, receiver: sanitizedReceiver };
    });

    return notificationsWithoutPassword
  }

  async createNotification(notificationDto: CreateNotificationDto): Promise<boolean> {
    const notification = this.notificationRepository.save(notificationDto);
    if (notification)
      return true;
    else return false;
  }
}
