import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechStack } from './techStack.entity';

@Injectable()
export class TechStackService {
  constructor(
    @InjectRepository(TechStack)
    private readonly techStackRepository: Repository<TechStack>,
  ) {}

  async findAll(): Promise<TechStack[]> {
    return this.techStackRepository.find();
  }
}
