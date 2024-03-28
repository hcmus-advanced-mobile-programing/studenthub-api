import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from 'src/modules/student/dto/update-student-profile.dto';
import { Student } from 'src/modules/student/student.entity';
import { TechStack } from 'src/modules/techStack/techStack.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
    @InjectRepository(TechStack)
    private TechStackRepository: Repository<TechStack>,
    @InjectRepository(SkillSet)
    private SkillSetRepository: Repository<SkillSet>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async createStudentProfile(studentProfileDto: CreateStudentProfileDto) {
    const userId = this.httpContext.getUser().id;
    const techStack = studentProfileDto.techStackId
      ? await this.TechStackRepository.findOne({ where: { id: studentProfileDto.techStackId } })
      : null;
    const skillSets = studentProfileDto.skillSets
      ? await this.SkillSetRepository.findByIds(studentProfileDto.skillSets)
      : [];

    const student = this.StudentRepository.create({
      ...studentProfileDto,
      userId,
      techStack,
      skillSets,
    });
    return await this.StudentRepository.save(student);
  }

  async updateStudentProfile(id: string, studentProfileDto: UpdateStudentProfileDto) {
    const userId = this.httpContext.getUser().id;
    const student = await this.StudentRepository.findOneBy({ id });

    if(!student) {
      throw new Error(`Not found: studentId = ${id}`);
    }

    if (student.userId !== userId) {
      throw new Error('You do not have permission to update this student profile');
    }
    const studentProfileToUpdate = await this.StudentRepository.findOneBy({ id });
    Object.assign(studentProfileToUpdate, { ...studentProfileDto });

    if (studentProfileDto.techStackId) {
      const techStack = await this.TechStackRepository.findOne({ where: { id: studentProfileDto.techStackId } });
      if (techStack) studentProfileToUpdate.techStack = techStack;
    }
    if (studentProfileDto.skillSets) {
      const skillSets = await this.SkillSetRepository.findByIds(studentProfileDto.skillSets);
      if (skillSets) studentProfileToUpdate.skillSets = skillSets;
    }

    return await this.StudentRepository.save(studentProfileToUpdate);
  }

  async getTechStackByUserId(id: number): Promise<TechStack | null> {
    const student = await this.StudentRepository.findOne({
      where: { id },
      relations: ['techStack'],
    });

    if (!student) {
      throw new NotFoundException(`Student with student ${id} not found`);
    }

    return student.techStack;
  }
}
