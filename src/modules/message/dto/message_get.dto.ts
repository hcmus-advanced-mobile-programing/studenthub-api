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
  @IsOptional()
  page: number | string = 1;

  @ApiProperty({ description: 'Page size' })
  @IsOptional()
  pageSize: number | string = 10;
}
