import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/modules/interview/interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
