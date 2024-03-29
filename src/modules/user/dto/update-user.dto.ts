import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { UserRole } from 'src/common/common.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsNotEmpty()
  roles: UserRole[];

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  fullname: string;
}
