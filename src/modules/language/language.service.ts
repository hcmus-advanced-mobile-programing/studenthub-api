import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentLanguageDto } from 'src/modules/language/dto/update-student-language.dto';
import { Language } from 'src/modules/language/language.entity';
import { Student } from 'src/modules/student/student.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findByStudentId(studentId: string): Promise<Language[]> {
    return this.languageRepository.findBy({ studentId });
  }

  async update(studentId: string, language: UpdateStudentLanguageDto): Promise<Language[]> {
    const { id } = this.httpContext.getUser();

    const student = await this.studentRepository.findOne({ where: { id: studentId, userId: id } });

    if (!student) {
      throw new Error('You are not authorized to update this student language');
    }

    const existingLanguages = await this.languageRepository.findBy({ studentId });
    const newLanguages: Language[] = [];
    for (const lang of language.languages) {
      if (lang.id) {
        const existingLang = existingLanguages.find((l) => l.id === lang.id);
        if (existingLang) {
          newLanguages.push(await this.languageRepository.save({ id: existingLang.id, ...lang }));
        }
      } else {
        newLanguages.push(await this.languageRepository.save({ studentId, ...lang }));
      }
    }
    for (const existingLang of existingLanguages) {
      if (!language.languages.find((l) => l.id === existingLang.id)) {
        await this.languageRepository.delete({ id: existingLang.id });
      }
    }
    return newLanguages;
  }

  // async create(languageName: string): Promise<SkillSet> {
  //   const language = new SkillSet();
  //   language.name = languageName;
  //   return this.skillSetRepository.save(skillSet);
  // }

  // async findOne(id: number): Promise<SkillSet> {
  //   const techStack = await this.skillSetRepository.findOne({ where: { id } });
  //   if (!techStack) {
  //     throw new NotFoundException(`Skill set with ID ${id} not found`);
  //   }
  //   return techStack;
  // }
}
