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
import { StatusFlag, TypeFlag } from 'src/common/common.enum';
import { DisableFlag } from 'src/common/common.enum';
import { CompanyProfileService } from 'src/modules/company/company.service';
import { Proposal } from 'src/modules/proposal/proposal.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(FavoriteProject)
    private favoriteProjectRepository: Repository<FavoriteProject>,
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    private MessageService: _MessageService,
    private CompanyService: CompanyProfileService,
    private readonly httpContext: HttpRequestContextService
  ) { }

  async _findAll(): Promise<Project[]> {
    return this.projectRepository.find({});
  }
  async findByCompanyId(companyId: number, typeFlag?: TypeFlag): Promise<Project[]> {
    const whereCondition: any = { companyId: companyId };

    if ([TypeFlag.New, TypeFlag.Working, TypeFlag.Archieved].includes(typeFlag)) {
      whereCondition.typeFlag = typeFlag;
    }

    const projects = await this.projectRepository.find({
      where: whereCondition,
      relations: [
        'proposals',
        'proposals.student',
        'proposals.student.user',
        'proposals.student.techStack',
        'proposals.student.educations',
      ],
    });

    // return empty array but not throw error
    if (!projects || projects.length === 0) {
      // throw new NotFoundException(`No projects found for company ID: ${companyId}`);
      return [];
    }

    const projectsWithDetails: any[] = [];

    for (const project of projects) {
      if (project.deletedAt === null) {
        const countProposals = project.proposals ? project.proposals.length : 0;
        const countHired = project.proposals
          ? project.proposals.filter((proposal) => proposal.statusFlag === StatusFlag.Hired).length
          : 0;
        const messageList = await this.MessageService.searchProjectId(Number(project.id));
        const countMessages = messageList.length;

        const proposals = project.proposals.map((item) => {
          return {
            ...item,
            student: {
              ...item.student,
              user: {
                fullname: item?.student.user.fullname,
              },
            },
          };
        });

        projectsWithDetails.push({
          ...project,
          proposals,
          countProposals,
          countMessages,
          countHired,
        });
      }
    }

    return projectsWithDetails;
  }

  async findByStudentId(studentId: number, typeFlag?: TypeFlag): Promise<Project[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`No student found with ID: ${studentId}`);
    }

    return await this.projectRepository.find({
      where: { proposals: { studentId: studentId, statusFlag: StatusFlag.Hired }, typeFlag },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        companyId: true,
        projectScopeFlag: true,
        title: true,
        description: true,
        numberOfStudents: true,
        typeFlag: true,
      },
    });
  }

  async create(project: ProjectCreateDto): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async findAll(filterDto: ProjectFilterDto): Promise<any[]> {
    const userId = this.httpContext.getUser().id;
    const student = await this.studentRepository.findOneBy({ userId: userId });
    const studentId = student ? student.id : null;


    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoin('project.proposals', 'proposal')
      .where('project.type_flag != :typeFlag', { typeFlag: TypeFlag.Archieved })
      .andWhere('project.deleted_at IS NULL')
      .select([
        "project.id AS id",
        "project.created_at AS createdAt",
        "project.updated_at AS updatedAt",
        "project.deleted_at AS deletedAt",
        "project.company_id AS companyId",
        "project.project_scope_flag AS projectScopeFlag",
        "project.title AS title",
        "project.description AS description",
        "project.number_of_students AS numberOfStudents",
        "project.type_flag AS typeFlag",
        "project.status AS status",
        "COUNT(proposal.id) AS proposalCount"]);

    if (filterDto.title !== undefined) {
      const title = filterDto.title.toLowerCase();
      query.andWhere('LOWER(project.title) LIKE :title', { title: `%${title}%` });
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
      query
        .groupBy('project.id')
        .having('COUNT(proposal.id) < :proposalsLessThan', { proposalsLessThan: filterDto.proposalsLessThan });
    }

    let skip = 0;
    let take = 10;

    if (filterDto.page && filterDto.perPage) {
      skip = (filterDto.page - 1) * filterDto.perPage;
      take = filterDto.perPage;
    }

    query.skip(skip).take(take);

    const projects = await query.getRawMany();

    if (projects.length === 0) {
      throw new NotFoundException(`No projects found`);
    }

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
      projects.map(async (project: any) => {
        let companyInfo;
        if (project.companyid) {
          try {
            companyInfo = await this.CompanyService.searchCompanyById(project.companyid);
          } catch (error) {
            companyInfo = null;
          }
        }
        return {
          id: project.id,
          createdAt: project.createdat,
          updatedAt: project.updatedat,
          deletedAt: project.deletedat,
          companyId: project.companyid,
          companyName: companyInfo ? companyInfo.companyName : null,
          projectScopeFlag: project.projectscopeflag,
          title: project.title,
          description: project.description,
          numberOfStudents: project.numberofstudents,
          typeFlag: project.typeflag,
          countProposals: project.proposalcount,
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

    const countHired = project.proposals
      ? project.proposals.filter((proposal) => proposal.statusFlag === StatusFlag.Hired).length
      : 0;

    return { ...project, companyName, countProposals, countMessages, countHired };
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.update(id, { deletedAt: new Date() });

    await this.proposalRepository.update({ projectId: id }, { disableFlag: DisableFlag.Disable });
  }

  async update(id: number, updatedProject: ProjectUpdateDto): Promise<void> {
    const project = await this.projectRepository.findOneBy({ id });
    await this.projectRepository.update(id, updatedProject);

    if (updatedProject.typeFlag === TypeFlag.Archieved) {
      await this.proposalRepository.update({ projectId: id }, { disableFlag: DisableFlag.Disable });
    } else if (project.typeFlag === TypeFlag.Archieved && updatedProject.typeFlag === TypeFlag.Working) {
      await this.proposalRepository.update({ projectId: id }, { disableFlag: DisableFlag.Enable });
    }
  }
}
