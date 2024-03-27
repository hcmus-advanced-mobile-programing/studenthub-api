import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStack } from './techStack.entity';
import { TechStackService } from './techStack.service';
import { TechStackController } from './techStack.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TechStack])],
  providers: [TechStackService],
  controllers: [TechStackController],
})
export class TechStackModule {}
