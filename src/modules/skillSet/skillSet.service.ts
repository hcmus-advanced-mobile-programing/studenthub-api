import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillSet } from './skillSet.entity';

@Injectable()
export class SkillSetService {
  constructor(
    @InjectRepository(SkillSet)
    private skillSetRepository: Repository<SkillSet>,
  ) {}

  async findAll(): Promise<SkillSet[]> {
    return this.skillSetRepository.find();
  }
}
