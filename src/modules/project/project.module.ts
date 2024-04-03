import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Message } from 'src/modules/message/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Message])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
