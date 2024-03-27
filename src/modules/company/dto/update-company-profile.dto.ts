import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyProfileDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;
}
