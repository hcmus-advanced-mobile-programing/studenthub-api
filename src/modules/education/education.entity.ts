import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';
import { Base } from 'src/common/base.entity';
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

  @Column({ name: 'start_year', type: 'int' })
  @Min(1900)
  @ApiProperty({ description: 'startYear' })
  startYear: number;

  @Column({ name: 'end_year', type: 'int' })
  @Min(1900)
  @ApiProperty({ description: 'endYear' })
  endYear: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
