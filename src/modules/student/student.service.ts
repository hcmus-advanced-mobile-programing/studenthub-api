import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GCSService } from 'src/modules/gcs/gcs.service';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from 'src/modules/student/dto/update-student-profile.dto';
import { GetStudentProfileDto } from 'src/modules/student/dto/get-student-profile.dto';
import { Student } from 'src/modules/student/student.entity';
import { User } from 'src/modules/user/user.entity';
import { TechStack } from 'src/modules/techStack/techStack.entity';
import { Education } from 'src/modules/education/education.entity';
import { Experience } from 'src/modules/experience/experience.entity';
import { Language } from 'src/modules/language/language.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/common.enum';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
    @InjectRepository(TechStack)
    private TechStackRepository: Repository<TechStack>,
    @InjectRepository(SkillSet)
    private SkillSetRepository: Repository<SkillSet>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Education)
    private readonly EducationRepository: Repository<Education>,
    @InjectRepository(Experience)
    private readonly ExperienceRepository: Repository<Experience>,
    @InjectRepository(Language)
    private readonly LanguageRepository: Repository<Language>,
    private readonly httpContext: HttpRequestContextService,
    private readonly gcsService: GCSService
  ) { }

  async createStudentProfile(studentProfileDto: CreateStudentProfileDto) {
    const { id, roles } = this.httpContext.getUser();

    const checkExist = await this.StudentRepository.findOneBy({ userId: id });

    if (checkExist) {
      throw new UnprocessableEntityException('Role student existed');
    }

    let techStack;
    if (studentProfileDto.techStackId !== null) {
      techStack = await this.TechStackRepository.findOne({ where: { id: studentProfileDto.techStackId } });
      if (!techStack) {
        throw new Error('Tech stack not found');
      }
    }
    const skillSets = studentProfileDto.skillSets
      ? await this.SkillSetRepository.findByIds(studentProfileDto.skillSets)
      : [];

    let student = this.StudentRepository.create({
      ...studentProfileDto,
      userId: id,
      techStack,
      skillSets,
    });

    student = await this.StudentRepository.save(student);

    if (student) {
      if (!roles.includes(UserRole.STUDENT)) {
        roles.push(UserRole.STUDENT);
        await this.UserRepository.update(id, { roles });
      }
    }

    return await this.StudentRepository.findOne({
      relations: ['techStack', 'proposals', 'educations', 'languages',  'experiences', 'experiences.skillSets', 'skillSets'],
      where: {id: student.id},
    },);
  }

  async updateStudentProfile(id: string, studentProfileDto: UpdateStudentProfileDto) {
    const userId = this.httpContext.getUser().id;
    const student = await this.StudentRepository.findOneBy({ id });

    if (!student) {
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

  async getStudentProfile(id: number | string): Promise<GetStudentProfileDto> {
    const userId = this.httpContext.getUser().id;
    const student = await this.StudentRepository.findOneBy({ id });
    if (!student) {
      throw new Error(`Not found: studentId = ${id}`);
    }

    if (student.userId !== userId) {
      throw new Error('You do not have permission to get this student profile');
    }

    const user = await this.UserRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }

    if (student.techStackId) {
      const techStack = await this.TechStackRepository.findOne({ where: { id: student.techStackId } });
      if (techStack) student.techStack = techStack;
    }

    const techStack = student.techStack;

    const skillSets = await this.SkillSetRepository.createQueryBuilder('skillSet')
      .innerJoin('skillSet.students', 'student')
      .where('student.id = :id', { id: student.id })
      .getMany();

    const educations = await this.EducationRepository.find({ where: { studentId: student.id } });

    const experiences = await this.ExperienceRepository.find({ where: { studentId: student.id } });

    const languages = await this.LanguageRepository.find({ where: { studentId: student.id } });

    return GetStudentProfileDto.fromEntities(student, user, techStack, skillSets, educations, experiences, languages);
  }

  async updateResume(file: Express.Multer.File, studentId: number) {
    try {
      const student = await this.StudentRepository.findOne({ where: { id: studentId } });
      if (!student) {
        throw new NotFoundException(`Student with student ${studentId} not found`);
      }
      const userId = this.httpContext.getUser().id;
      if (student.userId !== userId) {
        throw new Error('You do not have permission to update this student profile');
      }
      const newFileName = this.gcsService.uploadFile(file, 'resumes');
      const oldFileName = student.resume;
      if (oldFileName) {
        await this.gcsService.deleteFile(oldFileName);
      }
      student.resume = newFileName;
      return await this.StudentRepository.save(student);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getResume(studentId: number) {
    const student = await this.StudentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with student ${studentId} not found`);
    }

    if (student.resume) return await this.gcsService.getFile(student.resume);
    else return null;
  }

  async deleteResume(studentId: number) {
    const student = await this.StudentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with student ${studentId} not found`);
    }
    const userId = this.httpContext.getUser().id;
    if (student.userId !== userId) {
      throw new Error('You do not have permission to update this student profile');
    }

    const fileName = student.resume;
    if (fileName) {
      await this.gcsService.deleteFile(fileName);
      student.resume = null;
      return await this.StudentRepository.save(student);
    }
    return student;
  }

  async updateTranscript(file: Express.Multer.File, studentId: number) {
    try {
      const student = await this.StudentRepository.findOne({ where: { id: studentId } });
      if (!student) {
        throw new NotFoundException(`Student with student ${studentId} not found`);
      }
      const userId = this.httpContext.getUser().id;
      if (student.userId !== userId) {
        throw new Error('You do not have permission to update this student profile');
      }
      const newFileName = this.gcsService.uploadFile(file, 'transcripts');
      const oldFileName = student.transcript;
      if (oldFileName) {
        await this.gcsService.deleteFile(oldFileName);
      }
      student.transcript = newFileName;
      return await this.StudentRepository.save(student);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTranscript(studentId: number) {
    const student = await this.StudentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with student ${studentId} not found`);
    }

    if (student.transcript) return await this.gcsService.getFile(student.transcript);
    else return null;
  }

  async deleteTranscript(studentId: number) {
    const student = await this.StudentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with student ${studentId} not found`);
    }
    const userId = this.httpContext.getUser().id;
    if (student.userId !== userId) {
      throw new Error('You do not have permission to update this student profile');
    }

    const fileName = student.transcript;
    if (fileName) {
      await this.gcsService.deleteFile(fileName);
      student.transcript = null;
      return await this.StudentRepository.save(student);
    }
    return student;
  }
}
