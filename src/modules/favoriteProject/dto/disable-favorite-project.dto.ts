import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CompanySize, DisableFlag } from 'src/common/common.enum';

export class DisableFavorityProjectDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    projectId: string | number;

    @Type(() => Number)
    @IsEnum(DisableFlag, { message: 'Please enter a valid role' })
    @IsNotEmpty()
    @ApiProperty()
    disableFlag: DisableFlag;
}
