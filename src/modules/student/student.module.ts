import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfileController } from 'src/modules/student/student.controller';
import { StudentProfileService } from 'src/modules/student/student.service';
import { Student } from 'src/modules/student/student.entity';
import { SkillSet } from 'src/modules/skillSet/skillSet.entity';
import { TechStack } from 'src/modules/techStack/techStack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, SkillSet, TechStack]), ConfigModule],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentModule {}
