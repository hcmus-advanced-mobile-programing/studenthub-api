import { IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export class _InterviewUpdateDto {

  @IsNotEmpty()
  interviewId: number | string;

  @IsNotEmpty()
  senderId: number | string;

  @IsNotEmpty()
  receiverId: number | string;

  @IsNotEmpty()
  projectId: number | string;

  @IsOptional()
  title: string;

  @IsOptional()
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime: Date;

  @IsOptional()
  senderSocketId: string = '';

  @IsOptional()
  updateAction: boolean;

  @IsOptional()
  deleteAction: boolean;
}
