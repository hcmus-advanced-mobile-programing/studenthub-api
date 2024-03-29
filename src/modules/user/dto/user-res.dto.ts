import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/common.enum';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';

export class BaseUserResDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRole[];
}

export class UserResDto {
  @ApiProperty()
  readonly id: string | number;

  @IsString()
  @ApiProperty()
  fullname: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRole[];

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  student?: Student;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  company?: Company;
}
