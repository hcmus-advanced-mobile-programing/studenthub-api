import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectScopeFlag, TypeFlag } from 'src/common/common.enum';

export class ProjectFilterDto {

  @ApiPropertyOptional()
  projectScopeFlag?: ProjectScopeFlag;

  @ApiPropertyOptional()
  numberOfStudents?: number;

  @ApiPropertyOptional()
  proposalsLessThan?: number;
}
