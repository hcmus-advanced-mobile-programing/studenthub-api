import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'company',
  synchronize: false,
})
export class Company extends Base {
  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: 'userId' })
  userId: number | string;

  @Column()
  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'email' })
  email: string;

  @Column({ name: 'company_name' })
  @ApiProperty({ description: 'companyName' })
  companyName: string;

  @Column()
  @ApiProperty({ description: 'website' })
  website: string;

  @Column()
  @ApiProperty({ description: 'description' })
  description: string;

  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;
}
