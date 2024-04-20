import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DisableFlag, StatusFlag } from 'src/common/common.enum';

export class ProposalUpdateDto {
  @ApiProperty({ description: 'Cover Letter' })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ description: 'Status Flag', example: StatusFlag.Offer })
  @IsEnum(StatusFlag)
  @IsOptional()
  statusFlag: StatusFlag;

  @ApiProperty({ description: 'Disable Flag', example: DisableFlag.Enable })
  @IsEnum(DisableFlag)
  @IsOptional()
  disableFlag: DisableFlag;
}
