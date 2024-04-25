import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class InterviewDto {
  @IsNotEmpty()
  title: string;

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
}
