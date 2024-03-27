import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechStack } from './techStack.entity';

@Injectable()
export class TechStackService implements OnModuleInit{
  constructor(
    @InjectRepository(TechStack)
    private readonly techStackRepository: Repository<TechStack>,
  ) {}

  async onModuleInit() {
    const existingTechStacks = await this.techStackRepository.find();

    if (existingTechStacks.length === 0) {
      const techStacks = [
        "Fullstack Engineer",
        "Frontend Developer",
        "Backend Developer"
      ];

      for (const techStackName of techStacks) {
        const techStack = new TechStack();
        techStack.name = techStackName;

        await this.techStackRepository.save(techStack);
      }
    }
  }

  async findAll(): Promise<TechStack[]> {
    return this.techStackRepository.find();
  }

  async create(techStackName: string): Promise<TechStack> {
    const techStack = new TechStack();
    techStack.name = techStackName;
    return this.techStackRepository.save(techStack);
  }

  async findOne(id: number): Promise<TechStack> {
    const techStack = await this.techStackRepository.findOne({ where: { id } });
    if (!techStack) {
      throw new NotFoundException(`TechStack with ID ${id} not found`);
    }
    return techStack;
  }
}
