import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'tech_stack',
})
export class TechStack extends Base {
  @Column()
  @ApiProperty({ description: 'name' })
  name: string;
}
