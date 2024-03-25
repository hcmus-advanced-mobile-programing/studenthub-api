import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { Student } from 'src/modules/student/entities/student.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class StudentProfileService {
  private readonly logger = new Logger(StudentProfileService.name);

  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async createStudentProfile(studentProfileDto: CreateStudentProfileDto) {
    const userId = this.httpContext.getUser().id;
    const student = this.StudentRepository.create({
      ...studentProfileDto,
      userId,
    });
    return await this.StudentRepository.save(student);
  }

  async updateStudentProfile(id: string, studentProfileDto: CreateStudentProfileDto) {
    const userId = this.httpContext.getUser().id;
    const student = await this.StudentRepository.findOneBy({ id });
    if (student.userId !== userId) {
      throw new Error('You do not have permission to update this student profile');
    }
    return await this.StudentRepository.update({ id }, studentProfileDto);
  }
}
