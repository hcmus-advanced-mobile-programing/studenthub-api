import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { emptyStringAsNull, transformMultipleValueAsArray } from 'src/decorators/transform.decorator';
import { FindArgs } from 'src/shared/dtos/common.dtos';

export class ProposalFindArgs extends FindArgs {
  @ApiProperty({
    required: false,
    description: 'filter by status',
  })
  @Transform(emptyStringAsNull)
  @IsOptional()
  @Transform(transformMultipleValueAsArray)
  statusFlag?: string;
}
