import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Auth } from 'src/decorators/http.decorators';
import { UpdateStudentLanguageDto } from 'src/modules/language/dto/update-student-language.dto';
import { Language } from 'src/modules/language/language.entity';
import { LanguageService } from 'src/modules/language/language.service';

@Controller('api/language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('getByStudentId/:studentId')
  findByStudentId(@Param('studentId') studentId: string): Promise<Language[]> {
    return this.languageService.findByStudentId(studentId);
  }

  @Put('updateByStudentId/:studentId')
  @Auth()
  update(@Param('studentId') studentId: string, @Body() language: UpdateStudentLanguageDto): Promise<Language[]> {
    return this.languageService.update(studentId, language);
  }
}
