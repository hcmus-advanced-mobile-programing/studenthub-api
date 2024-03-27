import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TechStackService } from './techStack.service';
import { TechStack } from './techStack.entity';

@Controller('api/techstack')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Get('getAllTechStack')
  async findAll(): Promise<TechStack[]> {
    return this.techStackService.findAll();
  }

  @Post('createTechStack')
  async create(@Body('name') techStackName: string): Promise<TechStack> {
    return this.techStackService.create(techStackName);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TechStack> {
    return this.techStackService.findOne(id);
  }
}