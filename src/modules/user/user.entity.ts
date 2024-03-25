import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { UserRole } from 'src/common/common.enum';
import { Column, Entity, OneToOne } from 'typeorm';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';

@Entity({
  name: 'user',
})
export class User extends Base {
  @Column({ unique: true })
  @ApiProperty({ description: 'email' })
  email: string;

  @Column()
  @ApiProperty({ description: 'password' })
  password: string;

  @Column('text', { array: true, default: ['USER'] })
  @ApiProperty({ description: 'roles' })
  roles: UserRole[];

  @Column({ default: false })
  @ApiProperty({ description: 'isConfirmed' })
  isConfirmed: boolean;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Company, (company) => company.user)
  company: Company;
}
