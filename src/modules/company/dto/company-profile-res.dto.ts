import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CompanySize } from 'src/common/common.enum';

export class CompanyProfileResDto {
  @ApiProperty()
  readonly id: string | number;

  @IsNotEmpty()
  @ApiProperty()
  userId: string | number;

  @Type(() => Number)
  @IsNumber()
  @IsEnum(CompanySize, { message: 'Please enter a valid company size' })
  @ApiProperty({ description: 'companySize' })
  size: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'companyName' })
  companyName: string;

  @IsString()
  @ApiProperty({ description: 'website' })
  website: string;

  @IsString()
  @ApiProperty({ description: 'description' })
  description: string;
}
