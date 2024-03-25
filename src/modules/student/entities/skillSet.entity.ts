import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'skillSet',
})
export class SkillSet extends Base {
  @Column({ name: 'name' })
  @ApiProperty({ description: 'name' })
  name: string;
}
