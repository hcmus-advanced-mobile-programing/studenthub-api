import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfileController } from 'src/modules/student/student.controller';
import { StudentProfileService } from 'src/modules/student/student.service';
import { Student } from 'src/modules/student/student.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { TechStack } from 'src/modules/techStack/techStack.entity';
import { User } from 'src/modules/user/user.entity';
import { Education } from 'src/modules/education/education.entity';
import { Experience } from 'src/modules/experience/experience.entity';
import { Language } from 'src/modules/language/language.entity';
import { GCSService } from 'src/modules/gcs/gcs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, SkillSet, TechStack, User, Education, Experience, Language]),
    ConfigModule,
  ],
  controllers: [StudentProfileController],
  providers: [StudentProfileService, GCSService],
  exports: [StudentProfileService],
})
export class StudentModule {}
