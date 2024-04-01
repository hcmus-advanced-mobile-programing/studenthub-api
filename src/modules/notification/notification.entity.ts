import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { Message } from 'src/modules/message/message.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'notification',
  synchronize: true,
})
export class Notification extends Base {
  @Column({ name: 'sender_id', type: 'bigint', nullable: false })
  @ApiProperty({ description: 'senderId' })
  senderId: number | string;

  @Column({ name: 'receiver_id', type: 'bigint', nullable: false })
  @ApiProperty({ description: 'receiverId' })
  receiverId: number | string;

  @Column({ name: 'content', nullable: false })
  @ApiProperty({ description: 'content' })
  content: string;

  @Column({ name: 'title', nullable: false })
  @ApiProperty({ description: 'title' })
  title: string;

  @Column({ name: 'message_id', type: 'bigint' })
  @ApiProperty({ description: 'messageId' })
  messageId: number | string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
