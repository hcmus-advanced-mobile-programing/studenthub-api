import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Min } from 'class-validator';

export class StudentEducationDto {
  @ApiProperty({ default: null })
  id?: string | number;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1900)
  startYear: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1900)
  endYear: number;
}

export class UpdateStudentEducationDto {
  @ApiProperty({ type: [StudentEducationDto] })
  @IsArray()
  education: StudentEducationDto[];
}
