import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProjectSearchCompanyId  } from './dto/project-search.dto';
import { Project } from './project.entity';

@ApiTags('Project')
@Controller('api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':companyId')
  async projectSearchCompanyId(@Param() params: ProjectSearchCompanyId ): Promise<Project[]> {
    return this.projectService.findByCompanyId(params.companyId);
  }

  @Get(':id')
  async projectSearchId(@Param('id') id: number): Promise<Project> {
    return this.projectService.findById(id);
  }
}
