import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { Experience } from 'src/modules/experience/experience.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({
  name: 'skillSet',
})
export class SkillSet extends Base {
  @Column({ name: 'name' })
  @ApiProperty({ description: 'name' })
  name: string;

  @ManyToMany(() => Student, (student) => student.skillSets)
  students: Student[];

  @ManyToMany(() => Experience, (experience) => experience.skillSets)
  experiences: Experience[];
}
