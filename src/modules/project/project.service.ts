import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async findByCompanyId(companyId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { companyId: companyId },
    });

    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for company ID: ${companyId}`);
    }

    return projects;
  }

  async create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }
  async findAll(): Promise<Project[]> {
    const projects = (await this.projectRepository.find()) || [];
    return projects;
  }
  async findById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`No project found with ID: ${id}`);
    }

    return project;
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.update(id, { deletedAt: new Date() });
  }

  async update(id: number, updatedProject: Project): Promise<void> {
    await this.projectRepository.update(id, updatedProject);
  }
}
