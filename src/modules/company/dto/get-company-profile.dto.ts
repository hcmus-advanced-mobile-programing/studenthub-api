import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/user.entity';
import { Company } from 'src/modules/company/company.entity';
import { CompanySize } from 'src/common/common.enum';

export class GetCompanyProfileDto {
  @ApiProperty({ description: 'companyId' })
  id: number | string;

  @ApiProperty({ description: 'userId' })
  userId: number | string;

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @ApiProperty({ description: 'companyName' })
  companyName: string;

  @ApiProperty({ description: 'website' })
  website: string;

  @ApiProperty({ description: 'Size of the company' })
  size: CompanySize;

  @ApiProperty({ description: 'description' })
  description: string;

  static fromEntities(company: Company, user: User): GetCompanyProfileDto {
    const dto = new GetCompanyProfileDto();
    dto.id = company.id;
    dto.userId = company.userId;
    dto.email = user.email;
    dto.fullname = user.fullname;
    dto.companyName = company.companyName;
    dto.description = company.description;
    dto.website = company.website;
    dto.size = company.size;
    return dto;
  }
}
