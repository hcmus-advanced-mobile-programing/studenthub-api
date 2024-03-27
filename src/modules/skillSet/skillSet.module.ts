import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSet } from './skillSet.entity';
import { SkillSetService } from './skillSet.service';
import { SkillSetController } from './skillSet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SkillSet])],
  providers: [SkillSetService],
  controllers: [SkillSetController],
})
export class SkillSetModule {}
