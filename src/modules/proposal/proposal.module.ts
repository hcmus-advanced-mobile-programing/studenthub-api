import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalController } from 'src/modules/proposal/proposal.controller';
import { Proposal } from 'src/modules/proposal/proposal.entity';
import { ProposalService } from 'src/modules/proposal/proposal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), ConfigModule],
  controllers: [ProposalController],
  providers: [ProposalService],
  exports: [ProposalService],
})
export class ProposalModule {}
