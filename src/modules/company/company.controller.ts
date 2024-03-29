import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { CompanyProfileService } from 'src/modules/company/company.service';
import { CompanyProfileResDto } from 'src/modules/company/dto/company-profile-res.dto';
import { CreateCompanyProfileDto } from 'src/modules/company/dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from 'src/modules/company/dto/update-company-profile.dto';
import { GetCompanyProfileDto } from 'src/modules/company/dto/get-company-profile.dto';

@ApiTags('profile/company')
@Controller('api/profile/company')
export class CompanyProfileController {
  constructor(private companyProfileService: CompanyProfileService) {}

  @Auth()
  @Post()
  create(@Body() companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResDto> {
    return this.companyProfileService.createCompanyProfile(companyProfileDto);
  }

  @Auth()
  @Put(':id')
  update(@Param('id') id: string, @Body() companyProfileDto: UpdateCompanyProfileDto) {
    return this.companyProfileService.updateCompanyProfile(id, companyProfileDto);
  }

  @Auth()
  @Get(':companyId')
  async getStudentProfile(@Param('companyId') companyId: number | string): Promise<GetCompanyProfileDto> {
    return this.companyProfileService.getCompanyProfile(companyId);
  }
}
