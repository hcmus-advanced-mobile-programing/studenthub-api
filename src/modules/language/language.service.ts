import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentLanguageDto } from 'src/modules/language/dto/update-student-language.dto';
import { Language } from 'src/modules/language/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>
  ) {}

  async findByStudentId(studentId: string): Promise<Language[]> {
    return this.languageRepository.findBy({ studentId });
  }

  async update(studentId: string, language: UpdateStudentLanguageDto): Promise<Language[]> {
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
