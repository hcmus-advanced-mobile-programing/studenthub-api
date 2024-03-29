import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentEducationDto } from 'src/modules/education/dto/update-student-education.dto';
import { Education } from 'src/modules/education/education.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>
  ) {}

  async findByStudentId(studentId: string): Promise<Education[]> {
    return this.educationRepository.findBy({ studentId });
  }

  async update(studentId: string, education: UpdateStudentEducationDto): Promise<Education[]> {
    const existingEducations = await this.educationRepository.findBy({ studentId });
    const newEducations: Education[] = [];
    for (const edu of education.education) {
      if (edu.id) {
        const existingEducation = existingEducations.find((e) => e.id === edu.id);
        if (existingEducation) {
          newEducations.push(await this.educationRepository.save({ id: existingEducation.id, ...edu }));
        }
      } else {
        newEducations.push(await this.educationRepository.save({ studentId, ...edu }));
      }
    }
    for (const existingEducation of existingEducations) {
      if (!education.education.find((e) => e.id === existingEducation.id)) {
        await this.educationRepository.delete({ id: existingEducation.id });
      }
    }
    return newEducations;
  }
}
