import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { FavoriteProjectService } from 'src/modules/favoriteProject/favoriteProject.service';
import { FavoriteProjectResDto } from 'src/modules/favoriteProject/dto/favorite-project-res';
import { DisableFavorityProjectDto } from 'src/modules/favoriteProject/dto/disable-favorite-project.dto';

@ApiTags('favoriteProject')
@Controller('api/favoriteProject')
export class FavoriteProjectController {
  constructor(private favoriteProjectService: FavoriteProjectService) {}

  @Auth()
  @Get(':studentId')
  findOne(@Param('studentId') studentId: string): Promise<FavoriteProjectResDto[]> {
    return this.favoriteProjectService.searchStudentId(studentId);
  }

  @Auth()
  @Patch(':studentId')
  disable(@Param('studentId') studentId: string, @Body() params: DisableFavorityProjectDto): Promise<void> {
    return this.favoriteProjectService.disable(studentId, params);
  }
}
