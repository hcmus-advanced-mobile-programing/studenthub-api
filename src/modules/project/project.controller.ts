import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProjectSearchCompanyId } from './dto/project-search.dto';
import { Project } from './project.entity';

@ApiTags('Project')
@Controller('api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':companyId')
  async projectSearchCompanyId(@Param() params: ProjectSearchCompanyId): Promise<Project[]> {
    return this.projectService.findByCompanyId(params.companyId);
  }

  @Get(':id')
  async projectSearchId(@Param('id') id: number): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Post()
  async createNewProject(@Body() project: Project): Promise<Project> {
    const newProject = await this.projectService.create(project);
    return newProject;
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.projectService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatedProject: Project): Promise<void> {
    await this.projectService.update(id, updatedProject);
  }
}
