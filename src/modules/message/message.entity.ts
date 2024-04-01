import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { Project } from 'src/modules/project/project.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'message',
  synchronize: true,
})
export class Message extends Base {
  @Column({ name: 'sender_id', type: 'bigint', nullable: false })
  @ApiProperty({ description: 'senderId' })
  senderId: number | string;

  @Column({ name: 'receiver_id', type: 'bigint', nullable: false })
  @ApiProperty({ description: 'receiverId' })
  receiverId: number | string;

  @Column({ name: 'content', nullable: false })
  @ApiProperty({ description: 'content' })
  content: string;

  @Column({ name: 'message_flag', nullable: false })
  @ApiProperty({ description: 'messageFlag' })
  messageFlag: string;

  @Column({ name: 'project_id', type: 'bigint', nullable: false })
  @ApiProperty({ description: 'projectId' })
  projectId: number | string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
