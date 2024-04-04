import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProjectSearchCompanyId } from './dto/project-search.dto';
import { Project } from './project.entity';
import { ProjectCreateDto } from 'src/modules/project/dto/project-create.dto';
import { ProjectUpdateDto } from 'src/modules/project/dto/project-update.dto';
import { ProjectFilterDto } from 'src/modules/project/dto/project-filter.dto';

@ApiTags('project')
@Controller('api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(@Query() filterDto: ProjectFilterDto): Promise<any[]> {
    return this.projectService.findAll(filterDto);
  }
  
  @Get('/company/:companyId')
  async projectSearchCompanyId(@Param() params: ProjectSearchCompanyId): Promise<Project[]> {
    return this.projectService.findByCompanyId(params.companyId);
  }

  @Get(':projectId')
  async projectSearchId(@Param('projectId') id: number): Promise<any> {
    return this.projectService.findById(id);
  }

  @Post()
  async createNewProject(@Body() project: ProjectCreateDto): Promise<Project> {
    const newProject = await this.projectService.create(project);
    return newProject;
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: number): Promise<void> {
    await this.projectService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatedProject: ProjectUpdateDto): Promise<Project> {
    await this.projectService.update(id, updatedProject);
    return this.projectService.findById(id);
  }
}
