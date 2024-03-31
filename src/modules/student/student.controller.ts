import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from 'src/modules/student/dto/update-student-profile.dto';
import { GetStudentProfileDto } from 'src/modules/student/dto/get-student-profile.dto';
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

  @Auth()
  @Get(':studentId/techStack')
  async getTechStackByStudentId(@Param('studentId') studentId: number): Promise<TechStack | null> {
    return await this.studentProfileService.getTechStackByUserId(studentId);
  }

  @Auth()
  @Get(':studentId')
  async getStudentProfile(@Param('studentId') studentId: number | string): Promise<GetStudentProfileDto> {
    return this.studentProfileService.getStudentProfile(studentId);
  }

  @Auth()
  @Put(':studentId/resume')
  @UseInterceptors(FileInterceptor('file'))
  updateResume(@Param('studentId') studentId: number, @UploadedFile() file: Express.Multer.File) {
    return this.studentProfileService.updateResume(file, studentId);
  }
  @Auth()
  @Get(':studentId/resume')
  async getResume(@Param('studentId') studentId: number) {
    return await this.studentProfileService.getResume(studentId);
  }

  @Auth()
  @Delete(':studentId/resume')
  async deleteResume(@Param('studentId') studentId: number) {
    return await this.studentProfileService.deleteResume(studentId);
  }

  @Put(':studentId/transcript')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  updateTranscript(@Param('studentId') studentId: number, @UploadedFile() file: Express.Multer.File) {
    return this.studentProfileService.updateTranscript(file, studentId);
  }

  @Auth()
  @Get(':studentId/transcript')
  async getTranscript(@Param('studentId') studentId: number) {
    return await this.studentProfileService.getTranscript(studentId);
  }

  @Auth()
  @Delete(':studentId/transcript')
  async deleteTranscript(@Param('studentId') studentId: number) {
    return await this.studentProfileService.deleteTranscript(studentId);
  }
}
