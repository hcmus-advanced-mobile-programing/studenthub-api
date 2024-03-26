import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyProfileDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companySize: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;
}
