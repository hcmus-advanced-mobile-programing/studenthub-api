import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectScopeFlag, ProjectStatusFlag, TypeFlag } from 'src/common/common.enum';

export class ProjectUpdateDto {
  @ApiProperty({ description: 'Project Scope Flag', required: false })
  @IsEnum(ProjectScopeFlag)
  @IsOptional()
  projectScopeFlag?: ProjectScopeFlag;

  @ApiProperty({ description: 'title' })
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'Description of the project', example: 'Description of the project', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Number of Students' })
  @IsNumber()
  @IsNotEmpty()
  @IsNotIn([0])
  numberOfStudents: number;

  @ApiProperty({ description: 'Status of the project', example: TypeFlag.Working, required: false })
  @IsEnum(TypeFlag)
  @IsOptional()
  typeFlag?: TypeFlag;

  @ApiProperty({ description: 'Status of the project', example: ProjectStatusFlag.Working, required: false })
  @IsEnum(ProjectStatusFlag)
  @IsOptional()
  status?: ProjectStatusFlag;
}
