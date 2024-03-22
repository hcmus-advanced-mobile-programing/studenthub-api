import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag, StatusFlag, TypeFlag } from 'src/common/common.enum';
import { Base } from 'src/modules/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'project',
  synchronize: false,
})
export class Project extends Base {
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
}
