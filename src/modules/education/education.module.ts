import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationController } from 'src/modules/education/education.controller';
import { Education } from 'src/modules/education/education.entity';
import { EducationService } from 'src/modules/education/education.service';
import { Student } from 'src/modules/student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, Student])],
  providers: [EducationService],
  controllers: [EducationController],
})
export class EducationModule {}
