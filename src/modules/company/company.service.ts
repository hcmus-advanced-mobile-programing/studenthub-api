import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/company/company.entity';
import { CompanyProfileResDto } from 'src/modules/company/dto/company-profile-res.dto';
import { CreateCompanyProfileDto } from 'src/modules/company/dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from 'src/modules/company/dto/update-company-profile.dto';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyProfileService {
  private readonly logger = new Logger(CompanyProfileService.name);

  constructor(
    @InjectRepository(Company)
    private CompanyRepository: Repository<Company>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async createCompanyProfile(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResDto> {
    const userId = this.httpContext.getUser().id;
    const company = this.CompanyRepository.create({
      ...companyProfileDto,
      userId,
    });
    return await this.CompanyRepository.save(company);
  }

  async updateCompanyProfile(id: string, companyProfileDto: UpdateCompanyProfileDto) {
    const userId = this.httpContext.getUser().id;
    const company = await this.CompanyRepository.findOneBy({ id });
    if (company.userId !== userId) {
      throw new Error('You do not have permission to update this company profile');
    }
    return await this.CompanyRepository.update({ id }, companyProfileDto);
  }
}
