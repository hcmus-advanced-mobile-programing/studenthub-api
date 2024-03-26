import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfileController } from 'src/modules/student/student.controller';
import { StudentProfileService } from 'src/modules/student/student.service';
import { Student } from 'src/modules/student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), ConfigModule],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentModule {}
