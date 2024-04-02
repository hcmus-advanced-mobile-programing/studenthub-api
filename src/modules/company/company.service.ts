import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/company/company.entity';
import { User } from 'src/modules/user/user.entity';
import { CompanyProfileResDto } from 'src/modules/company/dto/company-profile-res.dto';
import { CreateCompanyProfileDto } from 'src/modules/company/dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from 'src/modules/company/dto/update-company-profile.dto';
import { GetCompanyProfileDto } from 'src/modules/company/dto/get-company-profile.dto';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyProfileService {
  private readonly logger = new Logger(CompanyProfileService.name);

  constructor(
    @InjectRepository(Company)
    private CompanyRepository: Repository<Company>,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async createCompanyProfile(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResDto> {
    const { id, roles } = this.httpContext.getUser();

    const checkExist = await this.CompanyRepository.findOneBy({ userId: id });

    if (checkExist) {
      throw new UnprocessableEntityException('Role company existed');
    }

    roles.push(1);
    await this.UserRepository.update(id, { roles });

    const company = this.CompanyRepository.create({
      ...companyProfileDto,
      userId: id,
    });
    return await this.CompanyRepository.save(company);
  }

  async updateCompanyProfile(id: string, companyProfileDto: UpdateCompanyProfileDto) {
    const userId = this.httpContext.getUser().id;
    const company = await this.CompanyRepository.findOneBy({ id });
    if (!company) {
      throw new Error(`Not found: companyId = ${id}`);
    }
    if (company.userId !== userId) {
      throw new Error('You do not have permission to update this company profile');
    }
    Object.assign(company, companyProfileDto);
    return await this.CompanyRepository.save(company);
  }

  async getCompanyProfile(id: number | string): Promise<GetCompanyProfileDto> {
    const userId = this.httpContext.getUser().id;
    const company = await this.CompanyRepository.findOneBy({ id });

    if (!company) {
      throw new Error(`Not found: companyId = ${id}`);
    }
    if (company.userId !== userId) {
      throw new Error('You do not have permission to update this company profile');
    }

    const user = await this.UserRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`Not found: userId = ${userId}`);
    }

    // const CompanySize = company.size;

    return GetCompanyProfileDto.fromEntities(company, user);
  }
}
