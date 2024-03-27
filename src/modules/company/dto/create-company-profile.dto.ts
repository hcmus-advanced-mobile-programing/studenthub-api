import { ApiProperty } from '@nestjs/swagger';
import { CompanySize } from 'src/common/common.enum';

export class CreateCompanyProfileDto {
  @ApiProperty({ required: true })
  fullname: string;

  @ApiProperty({ required: true })
  companyName: string;

  @ApiProperty({ required: true, type: 'enum', enum: CompanySize })
  size: CompanySize;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;
}
