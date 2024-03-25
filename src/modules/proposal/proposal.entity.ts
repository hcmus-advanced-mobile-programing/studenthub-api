import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag, StatusFlag } from 'src/common/common.enum';
import { Base } from 'src/modules/base/base.entity';
import { Project } from 'src/modules/project/project.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'proposal',
})
export class Proposal extends Base {
  @Column({ name: 'project_id', type: 'bigint' })
  @ApiProperty({ description: 'projectId' })
  projectId: number | string;

  @Column({ name: 'student_id', type: 'bigint' })
  @ApiProperty({ description: 'studentId' })
  studentId: number | string;

  @Column({ name: 'cover_letter' })
  @ApiProperty({ description: 'coverLetter' })
  coverLetter?: string;

  @Column({ name: 'status_flag' })
  @ApiProperty({ description: 'statusFlag' })
  statusFlag: StatusFlag;

  @Column({ name: 'disable_flag' })
  @ApiProperty({ description: 'disableFlag' })
  disableFlag: DisableFlag;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
