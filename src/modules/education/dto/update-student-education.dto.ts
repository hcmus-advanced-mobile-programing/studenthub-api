import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class StudentEducationDto {
  @ApiProperty({ default: null })
  id?: string | number;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiProperty()
  @IsDate()
  startYear: Date;

  @ApiProperty()
  @IsDate()
  endYear: Date;
}

export class UpdateStudentEducationDto {
  @ApiProperty({ type: [StudentEducationDto] })
  @IsArray()
  education: StudentEducationDto[];
}
