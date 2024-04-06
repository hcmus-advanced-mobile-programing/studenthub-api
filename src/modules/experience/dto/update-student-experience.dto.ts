import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StudentExperienceDto {
  @ApiProperty({ default: null })
  id?: string | number;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  startMonth: string;

  @ApiProperty()
  @IsNotEmpty()
  endMonth: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({})
  @IsArray()
  skillSets: string[] | number[];
}

export class UpdateStudentExperienceDto {
  @ApiProperty({ type: [StudentExperienceDto] })
  @IsArray()
  experience: StudentExperienceDto[];
}
