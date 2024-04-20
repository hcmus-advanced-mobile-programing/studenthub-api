import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { NotifyFlag, TypeNotifyFlag } from 'src/common/common.enum';
import { Message } from 'src/modules/message/message.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({
  name: 'notification',
})
export class Notification extends Base {
  @Column({ name: 'receiver_id', type: 'bigint' })
  @ApiProperty({ description: 'receiverId' })
  receiverId: number | string;

  @Column({ name: 'sender_id', type: 'bigint' })
  @ApiProperty({ description: 'senderId' })
  senderId: number | string;

  @Column({ name: 'message_id', type: 'bigint', nullable: true })
  @ApiProperty({ description: 'messageId' })
  messageId: number | string;

  @Column({ name: 'title' })
  @ApiProperty({ description: 'title' })
  title: string;

  @Column({ name: 'notifyFlag', type: 'bigint' })
  @ApiProperty({ description: 'notifyFlag' })
  notifyFlag: NotifyFlag;

  @Column({ name: 'typeNotifyFlag', type: 'bigint', default: NotifyFlag.Unread })
  @ApiProperty({ description: 'typeNotifyFlag' })
  typeNotifyFlag: TypeNotifyFlag;

  @Column({ name: 'content', nullable: true })
  @ApiProperty({ description: 'content' })
  content: string;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
