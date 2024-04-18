import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag } from 'src/common/common.enum';
import { Base } from 'src/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from 'src/modules/message/message.entity';

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

  @OneToMany(() => Message, (message) => message.interview)
  messages: Message[];
}
