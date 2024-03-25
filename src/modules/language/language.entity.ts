import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'language',
})
export class Language extends Base {
  @Column({ name: 'student_id', type: 'bigint' })
  @ApiProperty({ description: 'studentId' })
  studentId: number | string;

  @Column({ name: 'language_name' })
  @ApiProperty({ description: 'languageName' })
  languageName: string;

  @Column({ name: 'level' })
  @ApiProperty({ description: 'level' })
  level: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
