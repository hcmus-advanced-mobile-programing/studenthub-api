import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from 'src/modules/project/dto/project-create.dto';
import { ProjectUpdateDto } from 'src/modules/project/dto/project-update.dto';
import { ProjectFilterDto } from 'src/modules/project/dto/project-filter.dto';
import { MessageService as _MessageService } from 'src/modules/message/message.service';
import { TypeFlag } from 'src/common/common.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private MessageService: _MessageService
  ) {}

  async findByCompanyId(companyId: number, typeFlag: TypeFlag): Promise<Project[]> {
    console.log('type: ' + typeFlag)
    console.log('companyId: ' + companyId)
    
    const whereCondition: any = { companyId: companyId };
    
    if (typeFlag !== undefined) {
      whereCondition.typeFlag = typeFlag;
    }

    const projects = await this.projectRepository.find({
      where: whereCondition,
      relations: ['proposals'],
    });

    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for company ID: ${companyId}`);
    }

    const projectsWithDetails: any[] = [];

    for (const project of projects) {
      if (project.deletedAt === null) {
        const countProposals = project.proposals ? project.proposals.length : 0;
        const countHired = project.proposals
          ? project.proposals.filter((proposal) => proposal.statusFlag === 2).length
          : 0;
        const messageList = await this.MessageService.searchProjectId(Number(project.id));
        const countMessages = messageList.length;

        projectsWithDetails.push({
          ...project,
          countProposals,
          countMessages,
          countHired,
        });
      }
    }

    return projectsWithDetails;
  }

  async create(project: ProjectCreateDto): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async findAll(filterDto: ProjectFilterDto): Promise<any[]> {
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.proposals', 'proposal')
      .andWhere('project.deletedAt IS NULL');
  
    if (filterDto.title !== undefined) {
      query.andWhere('project.title = :title', {
        title: filterDto.title,
      });
    }
  
    if (filterDto.numberOfStudents !== undefined) {
      query.andWhere('project.numberOfStudents = :numberOfStudents', {
        numberOfStudents: filterDto.numberOfStudents,
      });
    }
  
    if (filterDto.projectScopeFlag !== undefined) {
      query.andWhere('project.projectScopeFlag = :projectScopeFlag', {
        projectScopeFlag: filterDto.projectScopeFlag,
      });
    }
  
    if (filterDto.proposalsLessThan !== undefined) {
      query.having('COUNT(proposal.id) < :proposalsLessThan', {
        proposalsLessThan: filterDto.proposalsLessThan,
      });
    }
  
    query.addSelect(['project.id', 'project.createdAt', 'project.updatedAt', 'project.deletedAt', 'project.companyId', 'project.projectScopeFlag', 'project.title', 'project.description', 'project.numberOfStudents', 'project.typeFlag', 'COUNT(proposal.id) AS countProposals'])
      .groupBy('project.id, proposal.id');
  
    const projects = await query.getRawMany();
  
    const projectsWithDetails = projects.map((project) => ({
      projectId: project.project_id,
      createdAt: project.project_created_at,
      updatedAt: project.project_updated_at,
      deletedAt: project.project_deleted_at,
      companyId: project.project_company_id,
      projectScopeFlag: project.project_project_scope_flag,
      title: project.project_title,
      description: project.project_description,
      numberOfStudents: project.project_number_of_students,
      typeFlag: project.project_type_flag,
      countProposals: parseInt(project.countProposals, 10) || 0,
    }));
  
    console.log(projectsWithDetails);  // Đoạn này sẽ in ra các dự án cùng với số lượng đề xuất liên quan
  
    return projectsWithDetails;
  }
  
  async findById(id: number): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['proposals'],
    });

    if (!project || project.deletedAt != null) {
      throw new NotFoundException(`No project found with ID: ${id}`);
    }

    const countProposals = project.proposals ? project.proposals.length : 0;

    const messageList = await this.MessageService.searchProjectId(id);
    const countMessages = messageList.length;

    const countHired = project.proposals ? project.proposals.filter((proposal) => proposal.statusFlag === 2).length : 0;

    return { project, countProposals, countMessages, countHired };
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.update(id, { deletedAt: new Date() });
  }

  async update(id: number, updatedProject: ProjectUpdateDto): Promise<void> {
    await this.projectRepository.update(id, updatedProject);
  }
}
