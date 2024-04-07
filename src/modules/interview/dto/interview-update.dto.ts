import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export class InterviewUpdateDto {
  @ApiProperty({ description: 'Title of the interview' })
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Start time of the interview' })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time of the interview' })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}
