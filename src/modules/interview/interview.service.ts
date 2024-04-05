import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DisableFlag } from 'src/common/common.enum';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewUpdateDto } from 'src/modules/interview/dto/interview-update.dto';
import { Interview } from 'src/modules/interview/interview.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly projectRepository: Repository<Interview>
  ) {}

  async findAll(): Promise<Interview[]> {
    return await this.projectRepository.find();
  }

  async findById(id: number): Promise<Interview> {
    return await this.projectRepository.findOne({ where: { id } });
  }

  async create(interview: InterviewCreateDto): Promise<InterviewCreateDto> {
    return await this.projectRepository.save(interview);
  }

  async update(id: number, interview: InterviewUpdateDto): Promise<void> {
    if (!this.projectRepository.findOne({ where: { id } })) {
      throw new Error('Interview not found');
    }
    await this.projectRepository.update(id, interview);
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.update(id, { deletedAt: new Date() });
  }

  async disable(id: number): Promise<void> {
    await this.projectRepository.update(id, { disableFlag: DisableFlag.Disable });
  }
}
