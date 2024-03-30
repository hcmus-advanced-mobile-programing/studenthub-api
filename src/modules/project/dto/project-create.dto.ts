import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
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

  @ApiProperty({ description: 'description of the project', example: 'description of the project' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ default: 0, description: 'Status of the project', example: TypeFlag.Working })
  @IsEnum(TypeFlag)
  typeFlag: TypeFlag;
}