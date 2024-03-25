import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyProfileDto {
  @ApiProperty({ required: true })
  fullname: string;

  @ApiProperty({ required: true })
  companyName: string;

  @ApiProperty({ required: true })
  companySize: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;
}
