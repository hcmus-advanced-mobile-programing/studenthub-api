import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag, StatusFlag } from 'src/common/common.enum';
import { Base } from 'src/modules/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'proposal',
  synchronize: false,
})
export class Proposal extends Base {
  @Column({ name: 'project_id', type: 'bigint' })
  @ApiProperty({ description: 'projectId' })
  projectId: number | string;

  @Column({ name: 'student_id', type: 'bigint' })
  @ApiProperty({ description: 'studentId' })
  studentId: number | string;

  @Column()
  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @Column({ name: 'cover_letter' })
  @ApiProperty({ description: 'coverLetter' })
  coverLetter: string;

  @Column({ name: 'status_flag' })
  @ApiProperty({ description: 'statusFlag' })
  statusFlag: StatusFlag;

  @Column({ name: 'disable_flag' })
  @ApiProperty({ description: 'disableFlag' })
  disableFlag: DisableFlag;
}
