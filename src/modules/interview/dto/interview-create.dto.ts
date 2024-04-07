import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag } from 'src/common/common.enum';
import { IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class InterviewCreateDto {
  @ApiProperty({ description: 'Title of the interview' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Start time of the interview' })
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time of the interview' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'Disable flag of the interview', enum: DisableFlag })
  @IsEnum(DisableFlag)
  disableFlag: DisableFlag;
}
