import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class InterviewUpdateDto {
  @ApiProperty({ description: 'Title of the interview' })
  @IsOptional()
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
