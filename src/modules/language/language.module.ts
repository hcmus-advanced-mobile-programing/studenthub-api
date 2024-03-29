import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageController } from './language.controller';
import { Language } from 'src/modules/language/language.entity';
import { LanguageService } from 'src/modules/language/language.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
