import { ApiProperty } from '@nestjs/swagger';
import { DisableFlag } from 'src/common/common.enum';
import { IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class InterviewCreateDto {
  @ApiProperty({ description: 'Title of the interview' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the interview' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Start time of the interview' })
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time of the interview' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'Project Id' })
  @IsNotEmpty()
  projectId: number | string;

  @ApiProperty({ description: 'Sender Id' })
  @IsNotEmpty()
  senderId: number | string;

  @ApiProperty({ description: 'Receiver Id' })
  @IsNotEmpty()
  receiverId: number | string;

  @ApiProperty({ description: 'Meeting room code' })
  @IsNotEmpty()
  meeting_room_code: string;

  @ApiProperty({ description: 'Meeting room Id' })
  @IsNotEmpty()
  meeting_room_id: string;

  @ApiProperty({ description: 'Meeting room expired at ' })
  expired_at?: Date;
}
