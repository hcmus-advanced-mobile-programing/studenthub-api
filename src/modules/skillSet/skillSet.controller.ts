import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SkillSetService } from './skillSet.service';
import { SkillSet } from './skillSet.entity';

@Controller('api/skillset')
export class SkillSetController {
  constructor(private readonly skillSetService: SkillSetService) {}

  @Get('getAllSkillSet')
  findAll(): Promise<SkillSet[]> {
    return this.skillSetService.findAll();
  }

  @Post('createTechStack')
  async create(@Body('name') skillSetName: string): Promise<SkillSet> {
    return this.skillSetService.create(skillSetName);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<SkillSet> {
    return this.skillSetService.findOne(id);
  }
}
