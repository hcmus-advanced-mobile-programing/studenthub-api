import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @Column({ name: 'start_month' })
  @ApiProperty({ description: 'startMonth' })
  startMonth: Date;

  @Column({ name: 'end_month' })
  @ApiProperty({ description: 'endMonth' })
  endMonth: Date;

  @Column({ name: 'description', nullable: true })
  @ApiProperty({ description: 'description' })
  description: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
