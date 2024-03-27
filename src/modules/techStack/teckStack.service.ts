import { Injectable, OnModuleInit } from '@nestjs/common';
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

  async findAll(): Promise<TechStack[]> {
    return this.techStackRepository.find();
  }
}
