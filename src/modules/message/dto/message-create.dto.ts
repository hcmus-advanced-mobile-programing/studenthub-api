import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class MessageCreateDto {
  @ApiProperty({ description: 'Project Id', type: 'bigint' })
  @IsNotEmpty()
  projectId: number | string;

  @ApiProperty({ description: 'Receiver Id' })
  @IsNotEmpty()
  receiverId: number | string;

  @ApiProperty({ description: 'Sender Id' })
  @IsNotEmpty()
  senderId: number | string;

  @ApiProperty({ description: 'Content' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Receiver Id' })
  @IsNotEmpty()
  @IsIn([0, 1], { message: 'Invalid value' })
  messageFlag: number;
}
