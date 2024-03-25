import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompanyProfileResDto {
  @ApiProperty()
  readonly id: string | number;

  @IsNotEmpty()
  @ApiProperty()
  userId: string | number;

  @IsString()
  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @IsString()
  @ApiProperty({ description: 'companySize' })
  companySize: string;

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
