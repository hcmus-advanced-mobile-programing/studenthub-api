import { IsNotEmpty, IsOptional } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  notificationId: string;

  @IsNotEmpty()
  receiverId: string;

  @IsOptional()
  senderId?: string;

  @IsOptional()
  projectId?: string;

}
