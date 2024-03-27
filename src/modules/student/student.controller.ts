import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from 'src/modules/student/dto/update-student-profile.dto';
import { StudentProfileService } from 'src/modules/student/student.service';
import { TechStack } from 'src/modules/techStack/techStack.entity';

@ApiTags('profile/student')
@Controller('api/profile/student')
export class StudentProfileController {
  constructor(private studentProfileService: StudentProfileService) {}

  @Auth()
  @Post()
  create(@Body() studentProfileDto: CreateStudentProfileDto) {
    return this.studentProfileService.createStudentProfile(studentProfileDto);
  }

  @Auth()
  @Put(':id')
  update(@Param('id') id: string, @Body() studentProfileDto: UpdateStudentProfileDto) {
    return this.studentProfileService.updateStudentProfile(id, studentProfileDto);
  }

  @Get(':userId/techStack')
  async getTechStackByUserId(@Param('userId') userId: number): Promise<TechStack | null> {
    return await this.studentProfileService.getTechStackByUserId(userId);
  }
}
