import { ApiProperty } from '@nestjs/swagger';
import { NotifyFlag, TypeNotifyFlag } from 'src/common/common.enum';

export class CreateNotificationDto {
  @ApiProperty({ description: 'receiverId' })
  receiverId: number | string;

  @ApiProperty({ description: 'senderId' })
  senderId: number | string;

  @ApiProperty({ description: 'messageId' })
  messageId: number | string;

  @ApiProperty({ description: 'title' })
  title: string;

  @ApiProperty({ description: 'notifyFlag' })
  notifyFlag: NotifyFlag;

  @ApiProperty({ description: 'typeNotifyFlag' })
  typeNotifyFlag: TypeNotifyFlag;

  @ApiProperty({ description: 'content' })
  content: string;
}
