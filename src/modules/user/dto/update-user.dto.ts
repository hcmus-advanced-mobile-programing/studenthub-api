import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from 'src/common/common.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNotEmpty()
  roles: UserRole[];

  @IsOptional()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsBoolean()
  isConfirm: boolean;
}
