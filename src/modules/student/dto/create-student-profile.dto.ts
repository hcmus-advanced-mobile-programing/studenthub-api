import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStudentProfileDto {

  @ApiProperty()
  @IsNotEmpty()
  techStackId: number | string;

  @ApiProperty()
  skillSets: number[] | string[];
}
