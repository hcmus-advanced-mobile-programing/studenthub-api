import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCreateDto } from 'src/modules/project/dto/project-create.dto';
import { ProjectUpdateDto } from 'src/modules/project/dto/project-update.dto';
import { ProjectFilterDto } from 'src/modules/project/dto/project-filter.dto';
import { MessageService as _MessageService } from 'src/modules/message/message.service';
import { Student } from 'src/modules/student/student.entity';
import { FavoriteProject } from 'src/modules/favoriteProject/favoriteProject.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { TypeFlag } from 'src/common/common.enum';
import { DisableFlag } from 'src/common/common.enum';
import { CompanyProfileService } from 'src/modules/company/company.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(FavoriteProject)
    private favoriteProjectRepository: Repository<FavoriteProject>,
    private MessageService: _MessageService,
    private CompanyService: CompanyProfileService,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByCompanyId(companyId: number, typeFlag?: TypeFlag): Promise<Project[]> {
    const whereCondition: any = { companyId: companyId };

    if ([TypeFlag.Working, TypeFlag.Archieved].includes(typeFlag)) {
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
    const userId = this.httpContext.getUser().id;
    const student = await this.studentRepository.findOneBy({ userId: userId });
    const studentId = student ? student.id : null;

    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.proposals', 'proposal')
      .andWhere('project.deletedAt IS NULL');

    if (filterDto.title !== undefined) {
      query.andWhere('project.title LIKE :title', {
        title: `%${filterDto.title}%`,
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

    const projects = await query.getMany();

    let favoriteProjectIds: (number | string)[] = [];

    if (studentId) {
      const favoriteProjects = await this.favoriteProjectRepository.find({
        where: {
          studentId,
          disableFlag: DisableFlag.Enable,
        },
        select: ['projectId'],
      });

      favoriteProjectIds = favoriteProjects.map((favorite) => favorite.projectId);
    }

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        let companyInfo;
        if (project.companyId) {
          try {
            companyInfo = await this.CompanyService.searchCompanyById(project.companyId);
          } catch (error) {
            companyInfo = null;
          }
        }
        return {
          id: project.id,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          deletedAt: project.deletedAt,
          companyId: project.companyId,
          companyName: companyInfo ? companyInfo.companyName : null,
          projectScopeFlag: project.projectScopeFlag,
          title: project.title,
          description: project.description,
          numberOfStudents: project.numberOfStudents,
          typeFlag: project.typeFlag,
          countProposals: project.proposals ? project.proposals.length : 0,
          isFavorite: favoriteProjectIds.includes(project.id),
        };
      })
    );

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

    const companyInfo = await this.CompanyService.searchCompanyById(project.companyId);
    const companyName = companyInfo.companyName;

    const countProposals = project.proposals ? project.proposals.length : 0;

    const messageList = await this.MessageService.searchProjectId(id);
    const countMessages = messageList.length;

    const countHired = project.proposals ? project.proposals.filter((proposal) => proposal.statusFlag === 2).length : 0;

    return { ...project, companyName, countProposals, countMessages, countHired };
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.update(id, { deletedAt: new Date() });
  }

  async update(id: number, updatedProject: ProjectUpdateDto): Promise<void> {
    await this.projectRepository.update(id, updatedProject);
  }
}
