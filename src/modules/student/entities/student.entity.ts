import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { Education } from 'src/modules/student/entities/education.entity';
import { Experience } from 'src/modules/student/entities/experience.entity';
import { Language } from 'src/modules/student/entities/language.entity';
import { SkillSet } from 'src/modules/student/entities/skillSet.entity';
import { TechStack } from 'src/modules/student/entities/techStack.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from 'typeorm';

@Entity({
  name: 'student',
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

  @Column({ name: 'skill_set_id', type: 'bigint' })
  @ApiProperty({ description: 'skillSetId' })
  skillSetId: number[] | string[];

  @Column({ name: 'resume' })
  @ApiProperty({ description: 'resume' })
  resume: string;

  @Column({ name: 'transcript' })
  @ApiProperty({ description: 'transcript' })
  transcript: string;

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

  @OneToMany(() => Language, (language) => language.student)
  languages: Language[];

  @OneToMany(() => Experience, (experience) => experience.student)
  experiences: Experience[];

  @ManyToMany(() => SkillSet)
  @JoinColumn({ name: 'skill_set_id' })
  skillSets: SkillSet[];
}
