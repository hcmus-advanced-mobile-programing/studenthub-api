import { ApiProperty } from '@nestjs/swagger';
import { CompanySize } from 'src/common/common.enum';

export class UpdateCompanyProfileDto {
  @ApiProperty()
  companyName: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;
}
