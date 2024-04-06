import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillSet } from './skillSet.entity';

@Injectable()
export class SkillSetService implements OnModuleInit {
  constructor(
    @InjectRepository(SkillSet)
    private skillSetRepository: Repository<SkillSet>
  ) {}

  async onModuleInit() {
    const existingSkillSets = await this.skillSetRepository.find();
    if (existingSkillSets.length === 0) {
      const skillSets = [
        'C',
        'C++',
        'C#',
        'Java',
        'Javascript',
        'Python',
        'React',
        'IOS',
        'Android',
        'Flutter',
        'NodeJS',
        'PHP',
        'Dart',
        'AWS',
        'MySQL',
        'CI/CD',
        'Go',
        'Kotlin',
      ];
      for (const skillSetName of skillSets) {
        const skillSet = new SkillSet();
        skillSet.name = skillSetName;
        await this.skillSetRepository.save(skillSet);
      }
    }
  }

  async findAll(): Promise<SkillSet[]> {
    return this.skillSetRepository.find();
  }

  async create(skillSetName: string): Promise<SkillSet> {
    const skillSet = new SkillSet();
    skillSet.name = skillSetName;
    return this.skillSetRepository.save(skillSet);
  }

  async findOne(id: number): Promise<SkillSet> {
    const techStack = await this.skillSetRepository.findOne({ where: { id } });
    if (!techStack) {
      throw new NotFoundException(`Skill set with ID ${id} not found`);
    }
    return techStack;
  }
}
