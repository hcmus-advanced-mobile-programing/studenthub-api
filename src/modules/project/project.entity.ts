import { ApiProperty } from '@nestjs/swagger';
import { TypeFlag } from 'src/common/common.enum';
import { Base } from 'src/common/base.entity';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({
  name: 'project',
  synchronize: false,
})
export class Project extends Base {
  @Column({ name: 'company_id', type: 'bigint' }) 
  @ApiProperty({ description: 'company_id' })
  companyId: number | string;

  @Column({ name: 'project_scope_id', type: 'bigint' })
  @ApiProperty({ description: 'projectScopeId' })
  projectScopeId: number | string;

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
}
