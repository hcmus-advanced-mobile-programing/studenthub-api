import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IsEmailAlreadyExist } from 'src/class.validator';
import { UserRole } from 'src/common/common.enum';

export class CreateCredentialDto {
  
  @IsEmailAlreadyExist({ message: 'Email already exists' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @Type(() => Number)
  @IsEnum(UserRole, { message: 'Please enter a valid role' })
  @IsNotEmpty()
  @ApiProperty()
  role: UserRole;
}

export class AuthCredentialsDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
