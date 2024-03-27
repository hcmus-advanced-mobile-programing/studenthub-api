import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentProfileDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  techStackId: number | string;

  @ApiProperty()
  skillSets: number[] | string[];
}
