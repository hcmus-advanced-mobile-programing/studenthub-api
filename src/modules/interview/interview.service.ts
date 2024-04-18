import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DisableFlag, MessageFlag } from 'src/common/common.enum';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewUpdateDto } from 'src/modules/interview/dto/interview-update.dto';
import { Interview } from 'src/modules/interview/interview.entity';
import { MessageService } from 'src/modules/message/message.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly projectRepository: Repository<Interview>,
    private readonly messageService: MessageService,
    private readonly authService: AuthService
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
    const newInterview = await this.projectRepository.save(interview);
    await this.messageService.createMessage({
      senderId: this.authService.getCurrentUser(),
      receiverId: 0,
      content: 'Interview created',
      interviewId: newInterview.id,
      messageFlag: MessageFlag.Interview,
      projectId: interview.projectId,
    });
    return newInterview;
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
    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.disableFlag === DisableFlag.Disable) {
      throw new Error('Interview already disabled');
    }
    await this.projectRepository.save({ ...interview, disableFlag: DisableFlag.Disable });
  }
}
