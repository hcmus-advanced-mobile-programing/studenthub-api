import { IsIn, IsNotEmpty } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  projectId: number | string;

  @IsNotEmpty()
  receiverId: number | string;

  @IsNotEmpty()
  senderId: number | string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsIn(['Schedule an interview', 'text'], { message: 'Invalid value' })
  type: string;
}
