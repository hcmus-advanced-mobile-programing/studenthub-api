import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { Education } from 'src/modules/education/education.entity';
import { Experience } from 'src/modules/experience/experience.entity';
import { Language } from 'src/modules/language/language.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { TechStack } from 'src/modules/techStack/techStack.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({
  name: 'student',
  synchronize: true,
})
export class Student extends Base {
  @Column({ name: 'user_id', type: 'bigint' })
  @ApiProperty({ description: 'userId' })
  userId: number | string;

  @Column({ name: 'tech_stack_id', type: 'bigint', nullable: true })
  @Optional()
  @ApiProperty({ description: 'techStackId', nullable: true })
  techStackId: number | string | null;

  @Column({ name: 'resume', nullable: true })
  @ApiProperty({ description: 'resume' })
  resume: string;

  @Column({ name: 'transcript', nullable: true })
  @ApiProperty({ description: 'transcript' })
  transcript: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TechStack, { nullable: true })
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

  @ManyToMany(() => SkillSet, (skillSet) => skillSet.students)
  @JoinTable()
  skillSets: SkillSet[];
}
