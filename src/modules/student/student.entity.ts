import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'student',
  synchronize: false,
})
export class Student extends Base {
  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: 'userId' })
  userId: number | string;

  @Column()
  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @Column({ name: 'tech_stack_id', type: 'bigint' })
  @ApiProperty({ description: 'techStackId' })
  techStackId: number | string;

  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;
}
