import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag } from 'src/common/common.enum';
import { Base } from 'src/common/base.entity';
import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Message } from 'src/modules/message/message.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';

@Entity({
  name: 'interview',
})
export class Interview extends Base {
  @Column({ name: 'title' })
  @ApiProperty({ description: 'title' })
  title: string;

  @Column({ name: 'start_time' })
  @ApiProperty({ description: 'startTime' })
  startTime: Date;

  @Column({ name: 'end_time' })
  @ApiProperty({ description: 'endTime' })
  endTime: Date;

  @Column({ name: 'disable_flag', default: DisableFlag.Enable })
  @ApiProperty({ description: 'disableFlag' })
  disableFlag: DisableFlag;

  @Column({ name: 'meeting_room_id', type: 'bigint'})
  meetingRoomId?: number | string;

  @OneToMany(() => Message, (message) => message.interview)
  messages: Message[];

  @OneToOne(() => MeetingRoom)
  @JoinColumn({ name: 'meeting_room_id' })
  meetingRoom: MeetingRoom;
}
