import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsEmailAlreadyExistConstraint } from 'src/class.validator';
import { Company } from 'src/modules/company/company.entity';
import { Student } from 'src/modules/student/student.entity';
import { UserController } from 'src/modules/user/user.controller';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { MailService } from 'src/modules/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Company]), ConfigModule],
  controllers: [UserController],
  providers: [IsEmailAlreadyExistConstraint, UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
