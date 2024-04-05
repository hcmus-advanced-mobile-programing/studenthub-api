import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from 'src/modules/project/dto/project-create.dto';
import { ProjectUpdateDto } from 'src/modules/project/dto/project-update.dto';
import { ProjectFilterDto } from 'src/modules/project/dto/project-filter.dto';
import { formatDistanceToNow } from 'date-fns';
import { MessageService } from 'src/modules/message/message.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private MessageService: MessageService
  ) {}

  async findByCompanyId(companyId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { companyId: companyId },
    });
  
    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for company ID: ${companyId}`);
    }
  
    const projectsWithDetails: any[] = [];
  
    for (const project of projects) {
      const proposalCount = project.proposals ? project.proposals.length : 0;
      const hiredCount = project.proposals ? project.proposals.filter(proposal => proposal.statusFlag === 2).length : 0;
      const projectAge = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });
      const messageList = await this.MessageService.searchProjectId(Number(project.id));
      const messageCount = messageList.length;
  
      projectsWithDetails.push({
        ...project,
        projectAge,
        proposalCount,
        messageCount,
        hiredCount
      });
    }
  
    return projectsWithDetails;
  }


  async create(project: ProjectCreateDto): Promise<Project> {
    return this.projectRepository.save(project);
  }
  async findAll(filterDto: ProjectFilterDto): Promise<any[]> {
    let query = this.projectRepository.createQueryBuilder('project');

    if (filterDto.numberOfStudents !== undefined) {
      query = query.andWhere('project.numberOfStudents = :numberOfStudents', { numberOfStudents: filterDto.numberOfStudents });
    }

    if (filterDto.projectScopeFlag !== undefined) {
      query = query.andWhere('project.projectScopeFlag = :projectScopeFlag', { projectScopeFlag: filterDto.projectScopeFlag });
    }

    if (filterDto.proposalsLessThan !== undefined) {
      query = query.andWhere('SIZE(project.proposals) < :proposalsLessThan', { proposalsLessThan: filterDto.proposalsLessThan });
    }

    const projects = await query.getMany();

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const proposalCount = project.proposals ? project.proposals.length : 0;
        const hiredCount = project.proposals ? project.proposals.filter(proposal => proposal.statusFlag === 2).length : 0;
        const projectAge = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });
        const messageList = await this.MessageService.searchProjectId(Number(project.id));
        const messageCount = messageList.length;

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

    const messageList = await this.MessageService.searchProjectId(Number(project.id));
    const messageCount = messageList.length;

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
