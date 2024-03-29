import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentExperienceDto } from 'src/modules/experience/dto/update-student-experience.dto';
import { Experience } from 'src/modules/experience/experience.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(SkillSet)
    private skillSetRepository: Repository<SkillSet>
  ) {}

  async findByStudentId(studentId: string): Promise<Experience[]> {
    return this.experienceRepository.findBy({ studentId });
  }

  async update(studentId: string, experience: UpdateStudentExperienceDto): Promise<Experience[]> {
    const existingExperiences = await this.experienceRepository.findBy({ studentId });
    const newExperiences: Experience[] = [];
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
