import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StudentLanguageDto {
  @ApiProperty({ default: null })
  id?: string | number;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  languageName: string;

  @ApiProperty({ default: '' })
  @IsString()
  level: string;
}
export class UpdateStudentLanguageDto {
  @ApiProperty({ type: [StudentLanguageDto] })
  @IsArray()
  languages: StudentLanguageDto[];
}
