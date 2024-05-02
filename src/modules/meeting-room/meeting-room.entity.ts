import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { Interview } from 'src/modules/interview/interview.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({
  name: 'meeting_room',
  synchronize: false,
})
export class MeetingRoom extends Base {
  @Column({ unique: true })
  @ApiProperty({ description: 'Unique code for the meeting room' })
  meeting_room_code: string;

  @Column()
  @ApiProperty({ description: 'ID of the meeting room' })
  meeting_room_id: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Expiration date and time of the meeting room', type: 'string', format: 'date-time' })
  expired_at: Date | null;

  @OneToOne(() => Interview, interview => interview.meetingRoom)
  interview: Interview;
}
