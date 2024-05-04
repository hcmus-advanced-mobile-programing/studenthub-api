import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentEducationDto } from 'src/modules/education/dto/update-student-education.dto';
import { Education } from 'src/modules/education/education.entity';
import { Student } from 'src/modules/student/student.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByStudentId(studentId: string): Promise<Education[]> {
    return this.educationRepository.findBy({ studentId });
  }

  async update(studentId: string, education: UpdateStudentEducationDto): Promise<Education[]> {
    const { id } = this.httpContext.getUser();

    const student = await this.studentRepository.findOne({ where: { id: studentId, userId: id } });

    if (!student) {
      throw new Error('You are not authorized to update this student language');
    }

    const existingEducations = await this.educationRepository.findBy({ studentId });
    const newEducations: Education[] = [];
    for (const edu of education.education) {
      if (edu.startYear > edu.endYear) {
        throw new Error('Start year should be less than end year');
      }
      if (edu.endYear > new Date().getFullYear() + 3) {
        throw new Error('End year should be less than or equal to current year + 3');
      }
    }
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
