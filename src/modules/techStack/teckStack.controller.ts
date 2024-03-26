import { Controller, Get } from '@nestjs/common';
import { TechStackService } from './teckStack.service';
import { TechStack } from './techStack.entity';

@Controller('api/techstack')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Get('getAllTechStack')
  async findAll(): Promise<TechStack[]> {
    return this.techStackService.findAll();
  }
}
