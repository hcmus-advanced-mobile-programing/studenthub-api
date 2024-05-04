import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PaginationResult, genPaginationResult } from 'src/shared/dtos/common.dtos';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { ProposalResDto } from 'src/modules/proposal/dto/proposal-res.dto';
import { ProposalFindArgs } from 'src/modules/proposal/dto/proposal-find-args.dto';
import { ProposalCreateDto } from 'src/modules/proposal/dto/proposal-create.dto';
import { ProposalUpdateDto } from 'src/modules/proposal/dto/proposal-update.dto';
import { Project } from 'src/modules/project/project.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { NotifyFlag, statusFlagToTypeNotifyMap } from 'src/common/common.enum';

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);

  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    private notificationService: NotificationService,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async searchProjectId(projectId: number | string, args: ProposalFindArgs): Promise<PaginationResult<ProposalResDto>> {
    const { limit, offset, statusFlag } = args;

    const record = this.proposalRepository.createQueryBuilder('proposal');

    record
      .select([
        'proposal.id',
        'proposal.createdAt',
        'proposal.updatedAt',
        'proposal.deletedAt',
        'proposal.projectId',
        'proposal.studentId',
        'proposal.coverLetter',
        'proposal.statusFlag',
        'proposal.disableFlag',
      ])
      .where('proposal.project_id = :projectId', { projectId })
      .andWhere('proposal.deleted_at IS NULL')
      .leftJoinAndSelect('proposal.student', 'student')
      .leftJoinAndSelect('student.user', 'user', 'user.deleted_at IS NULL')
      .leftJoinAndSelect('student.techStack', 'techStack')
      .leftJoinAndSelect('student.educations', 'education');

    if (statusFlag) {
      record.andWhere('proposal.status_flag IN (:...statusFlag)', { statusFlag });
    }

    const [items, count] = await record
      .limit(limit || 10)
      .offset(offset || 0)
      .getManyAndCount();

    const resultItems = items.map((item) => {
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

    return genPaginationResult(resultItems as any, count, args.offset, args.limit);
  }

  async findOne(id: string): Promise<ProposalResDto> {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
      relations: ['student', 'student.techStack', 'student.educations', 'student.user.fullname', 'student.skillSets'],
    });
    return proposal;
  }

  async createProposal(proposal: ProposalCreateDto): Promise<ProposalCreateDto> {
    const projectId = proposal.projectId;
    const project = await this.projectRepository.findOneBy({ id: projectId });

    if (!project || project.deletedAt != null) {
      throw new NotFoundException(`Project not found with id: ${projectId}`);
    }

    const checkProposal = await this.proposalRepository.findBy({ studentId: proposal.studentId, projectId: projectId });
    if (checkProposal.length > 0) {
      throw new ConflictException(`Proposal for project with ID ${projectId} already exists.`);
    }
    return this.proposalRepository.save(proposal);
  }

  async updateProposal(id: number | string, proposal: ProposalUpdateDto): Promise<void> {
    this.logger.log(`Update proposal with id: ${proposal}`);
    const proposalToUpdate = await this.proposalRepository.findOneBy({ id });

    if (!proposalToUpdate) throw new Error('Proposal not found');
    await this.proposalRepository.update(id, proposal);
    await this.notificationService.createNotification({
      senderId: proposalToUpdate.studentId,
      receiverId: proposalToUpdate.studentId,
      content: 'Proposal updated',
      title: proposalToUpdate.coverLetter,
      notifyFlag: NotifyFlag.Unread,
      typeNotifyFlag: statusFlagToTypeNotifyMap[proposalToUpdate.statusFlag],
      messageId: proposalToUpdate.id,
    });
  }

  async findByStudentId(studentId: string): Promise<ProposalResDto[]> {
    return this.proposalRepository.find({
      where: {
        student: {
          id: studentId,
        },
        deletedAt: null,
      },
    });
  }

  async findProjectByStudentId(studentId: number, args: ProposalFindArgs): Promise<Proposal[]> {
    const whereCondition: any = { studentId: studentId };

    if (Array.isArray(args.statusFlag) && args.statusFlag.length > 0) {
      whereCondition.statusFlag = In(args.statusFlag);
    }

    if (Array.isArray(args.typeFlag) && args.typeFlag.length > 0) {
      whereCondition.project = { typeFlag: In(args.typeFlag) };
    }

    return this.proposalRepository.find({
      where: whereCondition,
      relations: ['project'],
    });
  }
}
