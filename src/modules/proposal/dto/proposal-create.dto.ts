import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProposalCreateDto {
  @ApiProperty({ description: 'Project ID', type: 'bigint', required: true })
  @IsNotEmpty()
  projectId: number | string;

  @ApiProperty({ description: 'Student ID', type: 'bigint', required: true })
  @IsNotEmpty()
  studentId: number | string;

  @ApiProperty({ description: 'Cover Letter', required: false })
  @IsNotEmpty()
  @IsString()
  coverLetter?: string;
}
