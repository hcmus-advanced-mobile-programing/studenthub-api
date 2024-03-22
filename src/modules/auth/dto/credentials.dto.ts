import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRoleEnum } from 'src/roles/roles.enum';

export class CreateCredentialDto {
  @IsString()
  @ApiProperty()
  username: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty()
  password: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRoleEnum[];
}

export class AuthCredentialsDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
