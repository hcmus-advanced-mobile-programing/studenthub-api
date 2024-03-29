import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentProfileDto {

  @ApiProperty()
  techStackId: number | string;

  @ApiProperty()
  skillSets: number[] | string[];
}
