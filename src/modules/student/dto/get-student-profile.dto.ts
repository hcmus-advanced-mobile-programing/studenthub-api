import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/user.entity';
import { Student } from 'src/modules/student/student.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { Education } from 'src/modules/education/education.entity';
import { Experience } from 'src/modules/experience/experience.entity';
import { Language } from 'src/modules/language/language.entity';
import { TechStack } from 'src/modules/techStack/techStack.entity';

export class GetStudentProfileDto {
  @ApiProperty({ description: 'studentId' })
  id: number | string;

  @ApiProperty({ description: 'userId' })
  userId: number | string;

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'fullname' })
  fullname: string;

  @ApiProperty({ description: 'techStack' })
  techStack: TechStack;

  @ApiProperty({ description: 'resume' })
  resume: string;

  @ApiProperty({ description: 'transcript' })
  transcript: string;

  @ApiProperty({ description: 'skillSets' })
  skillSets: SkillSet[];

  @ApiProperty({ description: 'educations' })
  educations: Education[];

  @ApiProperty({ description: 'experiences' })
  experiences: Experience[];

  @ApiProperty({ description: 'languages' })
  languages: Language[];

  static fromEntities(student: Student, user: User, techStack: TechStack, skillSets: SkillSet[], educations: Education[], experiences: Experience[], languages: Language[]): GetStudentProfileDto {
    const dto = new GetStudentProfileDto();
    dto.id = student.id;
    dto.userId = student.userId;
    dto.email = user.email;
    dto.fullname = student.fullname;
    dto.techStack = student.techStack;
    dto.resume = student.resume;
    dto.transcript = student.transcript;
    dto.skillSets = skillSets;
    dto.educations = educations;
    dto.experiences = experiences;
    dto.languages = languages;
    return dto;
  }
}
