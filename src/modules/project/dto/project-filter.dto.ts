import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectScopeFlag } from 'src/common/common.enum';

export class ProjectFilterDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  projectScopeFlag?: ProjectScopeFlag;

  @ApiPropertyOptional()
  numberOfStudents?: number;

  @ApiPropertyOptional()
  proposalsLessThan?: number;

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  perPage?: number;
}
