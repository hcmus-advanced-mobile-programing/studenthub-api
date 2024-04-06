import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({
  name: 'experience',
})
export class Experience extends Base {
  @Column({ name: 'student_id', type: 'bigint' })
  @ApiProperty({ description: 'studentId' })
  studentId: number | string;

  @Column({ name: 'title' })
  @ApiProperty({ description: 'title' })
  title: string;

  @Column({ name: 'start_month', nullable: true })
  @ApiProperty({ description: 'startMonth' })
  startMonth: string;

  @Column({ name: 'end_month', nullable: true })
  @ApiProperty({ description: 'endMonth' })
  endMonth: string;

  @Column({ name: 'description', nullable: true })
  @ApiProperty({ description: 'description' })
  description: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToMany(() => SkillSet, (skillSet) => skillSet.experiences)
  @JoinTable()
  skillSets: SkillSet[];
}
