import { ApiProperty } from '@nestjs/swagger';

export class ProjectSearchCompanyId  {
  @ApiProperty({ description: 'Company ID ', type: 'bigint' })
  companyId: number;
}

export class ProjectSearchDto {
    @ApiProperty({ description: 'Project ID', type: 'bigint' })
    id: number;
  }