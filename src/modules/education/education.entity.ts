import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'education',
})
export class Education extends Base {
  @Column({ name: 'student_id', type: 'bigint' })
  @ApiProperty({ description: 'studentId' })
  studentId: number | string;

  @Column({ name: 'school_name' })
  @ApiProperty({ description: 'schoolName' })
  schoolName: string;

  @Column({ name: 'start_year' })
  @ApiProperty({ description: 'startYear' })
  startYear: Date;

  @Column({ name: 'end_year' })
  @ApiProperty({ description: 'endYear' })
  endYear: Date;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
