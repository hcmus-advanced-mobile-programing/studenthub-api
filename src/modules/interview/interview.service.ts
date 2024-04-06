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
    const interviews = await this.projectRepository.find({});
    return interviews.filter((i) => i.deletedAt === null);
  }

  async findById(id: number): Promise<Interview> {
    return await this.projectRepository.findOneBy({
      id,
    });
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
    const interview = await this.projectRepository.findOne({ where: { id } });
    console.log('♦️ | interview:', interview);
    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.disableFlag === DisableFlag.Disable) {
      throw new Error('Interview already disabled');
    }
    await this.projectRepository.save({ ...interview, disableFlag: DisableFlag.Disable });
  }
}
