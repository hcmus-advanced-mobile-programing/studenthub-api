import { IsOptional } from 'class-validator';
import { ProposalCreateDto } from 'src/modules/proposal/dto/proposal-create.dto';

export class ProposalDto extends ProposalCreateDto {
  @IsOptional()
  senderSocketId: string = '';
}
