import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileController } from 'src/modules/company/company.controller';
import { Company } from 'src/modules/company/company.entity';
import { CompanyProfileService } from 'src/modules/company/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), ConfigModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyModule {}
