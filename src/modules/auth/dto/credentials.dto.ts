import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IsEmailAlreadyExist } from 'src/class.validator';
import { UserRole } from 'src/common/common.enum';

export class CreateCredentialDto {
  @IsString()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'Email already exists' })
  @ApiProperty()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @Type(() => Number)
  @IsEnum(UserRole, { message: 'Please enter a valid role' })
  @ApiProperty()
  role: UserRole;
}

export class AuthCredentialsDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
