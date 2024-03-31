import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag, StatusFlag } from 'src/common/common.enum';
import { Base } from 'src/common/base.entity';
import { Project } from 'src/modules/project/project.entity';
import { Student } from 'src/modules/student/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'favorite_project',
})
export class FavoriteProject extends Base {
  @Column({ name: 'project_id', type: 'bigint' })
  @ApiProperty({ description: 'projectId' })
  projectId: number | string;

  @Column({ name: 'student_id', type: 'bigint' })
  @ApiProperty({ description: 'studentId' })
  studentId: number | string;

  @Column({ name: 'disable_flag', default: DisableFlag.Enable })
  @ApiProperty({ description: 'disableFlag' })
  disableFlag: DisableFlag;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
