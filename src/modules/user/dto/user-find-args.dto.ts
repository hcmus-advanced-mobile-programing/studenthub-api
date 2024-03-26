import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/common/common.enum';
import { FindArgs } from 'src/shared/dtos/common.dtos';

export class UserFindArgs extends FindArgs {
  @ApiProperty({
    required: false,
    description: 'filter by status',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  isActive?: boolean;

  @ApiProperty({
    required: false,
    description: 'filter by roles',
    default: UserRole.STUDENT,
  })
  @IsOptional()
  @IsString()
  roles?: string;
}
