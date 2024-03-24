import { ApiProperty } from '@nestjs/swagger';
import { ProposalResDto } from 'src/modules/proposal/dto/proposal-res.dto';
import { PaginationResult } from 'src/shared/dtos/common.dtos';

export class PaginateProposalDto extends PaginationResult<ProposalResDto> {
  @ApiProperty({
    required: true,
    type: [ProposalResDto],
  })
  items: ProposalResDto[];
}
