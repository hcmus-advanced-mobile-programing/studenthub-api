import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from 'src/modules/project/dto/project-create.dto';
import { ProjectUpdateDto } from 'src/modules/project/dto/project-update.dto';
import { formatDistanceToNow } from 'date-fns';
import { Message } from 'src/modules/message/message.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async findByCompanyId(companyId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { companyId: companyId },
    });

    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for company ID: ${companyId}`);
    }

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        // Đếm số lượng proposal
        const proposalCount = project.proposals ? project.proposals.length : 0;

        // Đếm số lượng proposal có StatusFlag = 2
        const hiredCount = project.proposals ? project.proposals.filter(proposal => proposal.statusFlag === 2).length : 0;

        // Tính khoảng thời gian mà project đã được tạo
        const projectAge = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });

        // Đếm số lượng message của project
        const messageCount = await this.messageRepository.countBy({ projectId: project.id });

        return {
          ...project,
          projectAge,
          proposalCount,
          messageCount,
          hiredCount
        };
      })
    );

    return projectsWithDetails;
  }

  async create(project: ProjectCreateDto): Promise<Project> {
    return this.projectRepository.save(project);
  }
  async findAll(): Promise<any[]> {
    const projects = (await this.projectRepository.find()) || [];

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        // Đếm số lượng proposal
        const proposalCount = project.proposals ? project.proposals.length : 0;

        // Đếm số lượng proposal có StatusFlag = 2
        const hiredCount = project.proposals ? project.proposals.filter(proposal => proposal.statusFlag === 2).length : 0;

        // Tính khoảng thời gian mà project đã được tạo
        const projectAge = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });

        // Đếm số lượng message của project
        const messageCount = await this.messageRepository.countBy({ projectId: project.id });

        return {
          ...project,
          projectAge,
          proposalCount,
          messageCount,
          hiredCount
        };
      })
    );

    return projectsWithDetails;
  }
  async findById(id: number): Promise<any> {
    const project = await this.projectRepository.findOne({ 
      where: { id },
      relations: ['proposals'] 
    });
    
    if (!project) {
      throw new NotFoundException(`No project found with ID: ${id}`);
    }

    const proposalCount = project.proposals ? project.proposals.length : 0;

    // Tính khoảng thời gian mà project đã được tạo
    const projectAge = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });

    const messageCount = await this.messageRepository.countBy({ projectId: id });

    const hiredCount = project.proposals ? project.proposals.filter(proposal => proposal.statusFlag === 2).length : 0;

    return {project, projectAge, proposalCount, messageCount, hiredCount};
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.update(id, { deletedAt: new Date() });
  }

  async update(id: number, updatedProject: ProjectUpdateDto): Promise<void> {
    await this.projectRepository.update(id, updatedProject);
  }
}
