import { ApiProperty } from '@nestjs/swagger';
import { ProjectScopeFlag, ProjectStatusFlag, TypeFlag } from 'src/common/common.enum';
import { Base } from 'src/common/base.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from 'src/modules/message/message.entity';

@Entity({
  name: 'project',
})
export class Project extends Base {
  @Column({ name: 'company_id', type: 'bigint' })
  @ApiProperty({ description: 'company_id' })
  companyId: number | string;

  @Column({ name: 'project_scope_flag', default: ProjectScopeFlag.LessThanOneMOnth })
  @ApiProperty({ description: 'projectScopeFlag' })
  projectScopeFlag: ProjectScopeFlag;

  @Column()
  @ApiProperty({ description: 'title' })
  title: string;

  @Column()
  @ApiProperty({ description: 'description' })
  description: string;

  @Column({ name: 'number_of_students', default: 0 })
  @ApiProperty({ description: 'Number of Students' })
  numberOfStudents: number;

  @Column({ name: 'type_flag', nullable: true, default: TypeFlag.New })
  @ApiProperty({ description: 'typeFlag' })
  typeFlag: TypeFlag;

  @Column({ name: 'status', default: ProjectStatusFlag.Working })
  @ApiProperty({ description: 'status' })
  status: ProjectStatusFlag;

  @OneToMany(() => Proposal, (proposal) => proposal.project)
  proposals: Proposal[];

  @OneToMany(() => Message, (message) => message.project)
  messages: Message[];
}
