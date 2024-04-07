import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { ProposalService } from './proposal.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { PaginateProposalDto } from 'src/modules/proposal/dto/paginate-proposal.dto';
import { ProposalFindArgs } from 'src/modules/proposal/dto/proposal-find-args.dto';
import { ProposalResDto } from 'src/modules/proposal/dto/proposal-res.dto';
import { ProposalCreateDto } from 'src/modules/proposal/dto/proposal-create.dto';
import { ProposalUpdateDto } from 'src/modules/proposal/dto/proposal-update.dto';

@ApiTags('proposal')
@Controller('api/proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Auth()
  @Get('getByProjectId/:projectId')
  searchProjectId(
    @Param('projectId') projectId: string,
    @Query() args: ProposalFindArgs
  ): Promise<PaginateProposalDto> {
    return this.proposalService.searchProjectId(projectId, args);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProposalResDto> {
    return this.proposalService.findOne(id);
  }

  @Auth()
  @Post()
  createProposal(@Body() proposal: ProposalCreateDto): Promise<ProposalCreateDto> {
    return this.proposalService.createProposal(proposal);
  }

  @Auth()
  @Patch(':id')
  updateProposal(@Param('id') id: number | string, @Body() proposal: ProposalUpdateDto): Promise<void> {
    return this.proposalService.updateProposal(id, proposal);
  }

  @Auth()
  @Get('student/:studentId')
  findByStudentId(@Param('studentId') studentId: string): Promise<ProposalResDto[]> {
    return this.proposalService.findByStudentId(studentId);
  }
}
