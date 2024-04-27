import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from 'src/modules/notification/dto/notification-create.dto';
import { Notification } from 'src/modules/notification/notification.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByReceiverId(receiverId: string): Promise<Notification[]> {
    const { id } = this.httpContext.getUser();
    if (receiverId !== id) {
      throw new Error('You are not authorized to view this notification');
    }
    return await this.notificationRepository.find({
      where: { receiverId },
      relations: ['message', 'sender', 'receiver'],
    });
  }

  async createNotification(notificationDto: CreateNotificationDto): Promise<boolean> {
    const notification = await this.notificationRepository.save(notificationDto);
    if (notification) return true;
    else return false;
  }
}
