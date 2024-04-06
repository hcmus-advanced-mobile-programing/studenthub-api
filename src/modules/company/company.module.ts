import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileController } from 'src/modules/company/company.controller';
import { Company } from 'src/modules/company/company.entity';
import { CompanyProfileService } from 'src/modules/company/company.service';
import { User } from 'src/modules/user/user.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User]), ConfigModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyModule {}
