import { IsNotEmpty } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  notificationId: string;

  @IsNotEmpty()
  receiverId: string;
}
