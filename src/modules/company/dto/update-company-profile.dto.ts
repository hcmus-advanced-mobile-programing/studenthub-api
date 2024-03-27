import { ApiProperty } from '@nestjs/swagger';
import { CompanySize } from 'src/common/common.enum';

export class UpdateCompanyProfileDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty({ type: 'enum', enum: CompanySize })
  size: CompanySize;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;
}
