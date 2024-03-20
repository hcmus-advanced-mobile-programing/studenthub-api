import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/roles/roles.enum';

export class BaseUserResDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles: UserRoleEnum[];
}

export class UserResDto extends BaseUserResDto {
  @ApiProperty()
  readonly id: string;
}
