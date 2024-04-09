import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Message } from 'src/modules/message/message.entity';
import { MessageService } from 'src/modules/message/message.service';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';
import { FavoriteProject } from 'src/modules/favoriteProject/favoriteProject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Message, Student, Company, FavoriteProject])],
  providers: [ProjectService, MessageService],
  controllers: [ProjectController],
})
export class ProjectModule {}
