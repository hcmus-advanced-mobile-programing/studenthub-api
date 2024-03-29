import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StudentProfileResDto {
  @ApiProperty()
  readonly id: string | number;

  @IsNotEmpty()
  @ApiProperty()
  userId: string | number;
}
