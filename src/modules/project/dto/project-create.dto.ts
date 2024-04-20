import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectScopeFlag, TypeFlag } from 'src/common/common.enum';

export class ProjectCreateDto {
  @ApiProperty({ description: 'Company ID', type: 'bigint' })
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ description: 'projectScopeFlag' })
  @IsEnum(ProjectScopeFlag)
  @IsNotEmpty()
  projectScopeFlag: ProjectScopeFlag;

  @ApiProperty({ description: 'title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Number of Students', default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @IsNotIn([0])
  numberOfStudents: number;

  @ApiProperty({ description: 'description of the project', example: 'description of the project' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
