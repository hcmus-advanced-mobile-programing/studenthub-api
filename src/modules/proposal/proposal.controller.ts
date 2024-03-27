import { Controller, Get, Param, Query } from '@nestjs/common';

import { ProposalService } from './proposal.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { PaginateProposalDto } from 'src/modules/proposal/dto/paginate-proposal.dto';
import { ProposalFindArgs } from 'src/modules/proposal/dto/proposal-find-args.dto';

@ApiTags('proposal')
@Controller('api/proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Auth()
  @Get(':projectId')
  searchProjectId(
    @Param('projectId') projectId: string,
    @Query() args: ProposalFindArgs
  ): Promise<PaginateProposalDto> {
    return this.proposalService.searchProjectId(projectId, args);
  }
}
