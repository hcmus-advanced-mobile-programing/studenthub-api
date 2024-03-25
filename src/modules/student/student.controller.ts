import { Body, Controller, Post, Put } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Auth, UUIDParam } from 'src/decorators/http.decorators';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from 'src/modules/student/dto/update-student-profile.dto';
import { StudentProfileService } from 'src/modules/student/student.service';

@ApiTags('profile/student')
@Controller('profile/student')
export class StudentProfileController {
  constructor(private studentProfileService: StudentProfileService) {}

  @Auth()
  @Post()
  create(@Body() studentProfileDto: CreateStudentProfileDto) {
    return this.studentProfileService.createStudentProfile(studentProfileDto);
  }

  @Auth()
  @Put(':id')
  update(@UUIDParam('id') id: string, @Body() studentProfileDto: UpdateStudentProfileDto) {
    return this.studentProfileService.updateStudentProfile(id, studentProfileDto);
  }
}
