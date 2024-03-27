import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { CompanySize } from 'src/common/common.enum';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'company',
  synchronize: true,
})
export class Company extends Base {
  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: 'userId' })
  userId: number | string;

  @Column()
  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @Column({ name: 'company_name', nullable: true })
  @ApiProperty({ description: 'companyName' })
  companyName: string;

  @Column({ name: 'website', nullable: true })
  @ApiProperty({ description: 'website' })
  website: string;

  @Column({ name: 'size', nullable: true })
  @ApiProperty({ description: 'Size of the company' })
  size: CompanySize;

  @Column({ name: 'description', nullable: true })
  @ApiProperty({ description: 'description' })
  description: string;

  @OneToOne(() => User, (user) => user.company)
  @JoinColumn()
  user: User;
}
