import { Controller, Get } from '@nestjs/common';
import { SkillSetService } from './skillSet.service';
import { SkillSet } from './skillSet.entity';

@Controller('api/skillset')
export class SkillSetController {
  constructor(private readonly skillSetService: SkillSetService) {}

  @Get('getAllSkillSet')
  findAll(): Promise<SkillSet[]> {
    return this.skillSetService.findAll();
  }
}
