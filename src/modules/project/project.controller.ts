import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { ProjectCreateDto } from 'src/modules/project/dto/project-create.dto';
import { ProjectUpdateDto } from 'src/modules/project/dto/project-update.dto';
import { ProjectFilterDto } from 'src/modules/project/dto/project-filter.dto';
import { Auth } from 'src/decorators/http.decorators';
import { TypeFlag } from 'src/common/common.enum';

@ApiTags('project')
@Controller('api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Auth()
  @Get()
  async findAll(@Query() filterDto: ProjectFilterDto): Promise<any[]> {
    return this.projectService.findAll(filterDto);
  }

  @Auth()
  @Get('company/:companyId')
  @ApiQuery({ name: 'typeFlag', required: false })
  async projectSearchCompanyId(
    @Param('companyId') companyId: number,
    @Query('typeFlag') typeFlag?: TypeFlag
  ): Promise<Project[]> {
    return this.projectService.findByCompanyId(companyId, typeFlag);
  }

  @Auth()
  @Get(':projectId')
  async projectSearchId(@Param('projectId') id: number): Promise<any> {
    return this.projectService.findById(id);
  }

  @Auth()
  @Post()
  async createNewProject(@Body() project: ProjectCreateDto): Promise<Project> {
    const newProject = await this.projectService.create(project);
    return newProject;
  }

  @Auth()
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: number): Promise<void> {
    await this.projectService.delete(id);
  }

  @Auth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatedProject: ProjectUpdateDto): Promise<Project> {
    await this.projectService.update(id, updatedProject);
    return this.projectService.findById(id);
  }
}
