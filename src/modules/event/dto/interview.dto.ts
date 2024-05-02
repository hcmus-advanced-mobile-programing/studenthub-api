import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class InterviewDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  endTime: Date;

  @IsNotEmpty()
  projectId: number | string;

  @IsNotEmpty()
  senderId: number | string;

  @IsNotEmpty()
  receiverId: number | string;

  @IsOptional()
  senderSocketId: string = '';

  @IsNotEmpty()
  meeting_room_code: string;

  @IsNotEmpty()
  meeting_room_id: string;
  
  @IsOptional()
  expired_at?: Date;
}
