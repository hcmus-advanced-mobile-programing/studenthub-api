import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentProfileDto {
  @ApiProperty({ required: true })
  fullname: string;

  @ApiProperty({ required: true })
  techStackId: number | string;

  @ApiProperty()
  skillSets: number[] | string[];
}
