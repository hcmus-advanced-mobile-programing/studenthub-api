import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Auth } from 'src/decorators/http.decorators';
import { UpdateStudentEducationDto } from 'src/modules/education/dto/update-student-education.dto';
import { Education } from 'src/modules/education/education.entity';
import { EducationService } from 'src/modules/education/education.service';

@Controller('api/education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('getByStudentId/:studentId')
  findByStudentId(@Param('studentId') studentId: string): Promise<Education[]> {
    return this.educationService.findByStudentId(studentId);
  }

  @Put('updateByStudentId/:studentId')
  @Auth()
  update(@Param('studentId') studentId: string, @Body() education: UpdateStudentEducationDto): Promise<Education[]> {
    return this.educationService.update(studentId, education);
  }
}
