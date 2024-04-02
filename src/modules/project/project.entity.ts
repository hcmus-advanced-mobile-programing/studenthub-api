import { ApiProperty } from '@nestjs/swagger';
import { ProjectScopeFlag, TypeFlag } from 'src/common/common.enum';
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

  @Column({ name: 'project_scope_flag', default: ProjectScopeFlag.OneToThreeMonth })
  @ApiProperty({ description: 'projectScopeFlag' })
  projectScopeFlag: ProjectScopeFlag;

  @Column()
  @ApiProperty({ description: 'title' })
  title: string;

  @Column()
  @ApiProperty({ description: 'description' })
  description: string;

  @Column({ name: 'type_flag' })
  @ApiProperty({ description: 'typeFlag' })
  typeFlag: TypeFlag;

  @OneToMany(() => Proposal, (proposal) => proposal.student)
  proposals: Proposal[];

  @OneToMany(() => Message, message => message.project)
  messages: Message[];
}
