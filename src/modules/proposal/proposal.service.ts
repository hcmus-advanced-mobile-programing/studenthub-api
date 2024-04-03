import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationResult, genPaginationResult } from 'src/shared/dtos/common.dtos';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { ProposalResDto } from 'src/modules/proposal/dto/proposal-res.dto';
import { ProposalFindArgs } from 'src/modules/proposal/dto/proposal-find-args.dto';
import { ProposalCreateDto } from 'src/modules/proposal/dto/proposal-create.dto';
import { ProposalUpdateDto } from 'src/modules/proposal/dto/proposal-update.dto';

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);

  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async searchProjectId(projectId: number | string, args: ProposalFindArgs): Promise<PaginationResult<ProposalResDto>> {
    const { limit, offset, statusFlag } = args;

    const record = this.proposalRepository.createQueryBuilder('proposal');

    record
      .where('proposal.project_id = :projectId', { projectId })
      .leftJoinAndSelect('proposal.student', 'student')
      .leftJoinAndSelect('student.techStack', 'techStack')
      .leftJoinAndSelect('student.educations', 'education');

    if (statusFlag) {
      record.where('proposal.status_flag = :statusFlag', { statusFlag });
    }

    const [items, count] = await record
      .limit(limit || 10)
      .offset(offset || 0)
      .getManyAndCount();

    return genPaginationResult(items, count, args.offset, args.limit);
  }

  async findOne(id: string): Promise<ProposalResDto> {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id,
      },
      relations: ['student', 'student.techStack', 'student.educations'],
    });

    return proposal;
  }

  async createProposal(proposal: ProposalCreateDto): Promise<ProposalCreateDto> {
    return this.proposalRepository.save(proposal);
  }

  async updateProposal(id: number | string, proposal: ProposalUpdateDto): Promise<void> {
    const proposalToUpdate = await this.proposalRepository.findOneBy({ id });
    if (!proposalToUpdate) throw new Error('Proposal not found');
    await this.proposalRepository.update(id, proposal);
  }

  async findByStudentId(studentId: string): Promise<ProposalResDto[]> {
    return this.proposalRepository.find({
      where: {
        student: {
          id: studentId,
        },
      },
    });
  }
}
