import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { Education } from 'src/modules/student/education.entity';
import { TechStack } from 'src/modules/student/techStack.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

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

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => TechStack)
  @JoinColumn({ name: 'tech_stack_id' })
  techStack: TechStack;

  @OneToMany(() => Proposal, (proposal) => proposal.student)
  proposals: Proposal[];

  @OneToMany(() => Education, (education) => education.student)
  educations: Education[];
}
