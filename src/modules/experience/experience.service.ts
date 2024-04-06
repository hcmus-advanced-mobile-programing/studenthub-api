import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MM_YYYY_FORMAT_REGEX } from 'src/common/commom.constant';
import { UpdateStudentExperienceDto } from 'src/modules/experience/dto/update-student-experience.dto';
import { Experience } from 'src/modules/experience/experience.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { Student } from 'src/modules/student/student.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(SkillSet)
    private skillSetRepository: Repository<SkillSet>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByStudentId(studentId: string): Promise<Experience[]> {
    return this.experienceRepository.find({ where: { studentId }, relations: ['skillSets'] });
  }

  async update(studentId: string, experience: UpdateStudentExperienceDto): Promise<Experience[]> {
    const { id } = this.httpContext.getUser();

    const student = await this.studentRepository.findOne({ where: { id: studentId, userId: id } });

    if (!student) {
      throw new Error('You are not authorized to update this student language');
    }

    const existingExperiences = await this.experienceRepository.findBy({ studentId });
    const newExperiences: Experience[] = [];

    for (const expe of experience.experience) {
      if (MM_YYYY_FORMAT_REGEX.test(expe.startMonth) === false && new Date(expe.startMonth) <= new Date()) {
        throw new Error('Start month should be in MM-YYYY format or should be less than or equal now');
      }
      if (MM_YYYY_FORMAT_REGEX.test(expe.endMonth) === false || expe.endMonth !== 'Present') {
        throw new Error('Start month and end month should be in MM-YYYY format');
      }
      if (expe.endMonth !== 'Present' && new Date(expe.startMonth) > new Date(expe.endMonth)) {
        throw new Error('Start month should be less than end month');
      }
    }

    for (const expe of experience.experience) {
      if (expe.id) {
        const existingExperience = existingExperiences.find((e) => e.id === expe.id);
        if (existingExperience) {
          const skillSetIds = expe.skillSets;
          const skillSets = await this.skillSetRepository.findByIds(skillSetIds);
          newExperiences.push(await this.experienceRepository.save({ id: existingExperience.id, ...expe, skillSets }));
        }
      } else {
        const skillSetIds = expe.skillSets;
        const skillSets = await this.skillSetRepository.findByIds(skillSetIds);
        newExperiences.push(await this.experienceRepository.save({ studentId, ...expe, skillSets }));
      }
    }

    for (const existingExperience of existingExperiences) {
      if (!experience.experience.find((e) => e.id === existingExperience.id)) {
        await this.experienceRepository.delete({ id: existingExperience.id });
      }
    }
    return newExperiences;
  }
}
