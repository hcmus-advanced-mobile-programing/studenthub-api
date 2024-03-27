import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Experience } from 'src/modules/experience/experience.entity';
import { UpdateStudentExperienceDto } from 'src/modules/experience/dto/update-student-experience.dto';
import { ExperienceService } from 'src/modules/experience/experience.service';

@Controller('api/experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get('getByStudentId/:studentId')
  findByStudentId(@Param('studentId') studentId: string): Promise<Experience[]> {
    return this.experienceService.findByStudentId(studentId);
  }

  @Put('updateByStudentId/:studentId')
  update(@Param('studentId') studentId: string, @Body() experience: UpdateStudentExperienceDto): Promise<Experience[]> {
    return this.experienceService.update(studentId, experience);
  }
}
