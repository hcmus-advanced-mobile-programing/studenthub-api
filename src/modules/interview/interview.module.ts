import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/modules/interview/interview.entity';
import { MessageModule } from 'src/modules/message/message.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Interview]), MessageModule, AuthModule],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}