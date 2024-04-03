import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class MessageGetDto {
  @ApiProperty({ description: 'Project Id', type: 'bigint' })
  @IsNotEmpty()
  projectId: number | string;

  @ApiProperty({ description: 'Receiver Id' })
  @IsNotEmpty()
  receiverId: number | string;

  @ApiProperty({ description: 'Page' })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ description: 'Page size' })
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;
}
