import { IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from 'src/modules/student/student.entity';
import { Project } from 'src/modules/project/project.entity';
import { DisableFlag } from 'src/common/common.enum';

export class FavoriteProjectResDto {
  @IsObject()
  @ApiProperty()
  project?: Project;

  @IsNumber()
  @ApiProperty()
  countProposals: number
}
