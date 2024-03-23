import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StatusFlag } from 'src/common/common.enum';
import { FindArgs } from 'src/shared/dtos/common.dtos';

export class ProposalFindArgs extends FindArgs {
  @ApiProperty({
    required: false,
    description: 'filter by status',
  })
  @IsOptional()
  @IsString()
  statusFlag?: StatusFlag;
}
