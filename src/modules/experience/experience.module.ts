import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceController } from 'src/modules/experience/experience.controller';
import { Experience } from 'src/modules/experience/experience.entity';
import { ExperienceService } from 'src/modules/experience/experience.service';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { Student } from 'src/modules/student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, SkillSet, Student])],
  providers: [ExperienceService],
  controllers: [ExperienceController],
})
export class ExperienceModule {}
