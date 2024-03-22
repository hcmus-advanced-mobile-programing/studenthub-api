import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/common.enum';
import { Student } from 'src/modules/student/student.entity';
import { Company } from 'src/modules/company/company.entity';

export class BaseUserResDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRole[];
}

export class UserResDto {
  @ApiProperty()
  readonly id: string | number;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRole[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  student?: Student;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  company?: Company;
}
