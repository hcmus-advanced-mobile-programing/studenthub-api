import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationController } from 'src/modules/education/education.controller';
import { Education } from 'src/modules/education/education.entity';
import { EducationService } from 'src/modules/education/education.service';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  providers: [EducationService],
  controllers: [EducationController],
})
export class EducationModule {}
