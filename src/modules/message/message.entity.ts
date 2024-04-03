import { ApiProperty } from '@nestjs/swagger';
import { MessageFlag, UserRole } from 'src/common/common.enum';
import { Base } from 'src/common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from 'src/modules/user/user.entity';
import { Project } from 'src/modules/project/project.entity';
import { Interview } from 'src/modules/interview/interview.entity';

@Entity({
  name: 'message',
})
export class Message extends Base {
  @Column({ name: 'sender_id', type: 'bigint' })
  senderId: number | string;

  @Column({ name: 'receiver_id', type: 'bigint' })
  receiverId: number | string;

  @Column({ name: 'project_id', type: 'bigint' })
  projectId: number | string;

  @Column({ name: 'interview_id', type: 'bigint', nullable: true })
  interviewId?: number | string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'message_flag', default: MessageFlag.Message })
  messageFlag: MessageFlag;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Interview)
  @JoinColumn({ name: 'interview_id' })
  interview?: Interview;
}
