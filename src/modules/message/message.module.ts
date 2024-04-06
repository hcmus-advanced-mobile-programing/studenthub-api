import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Student, Company])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
