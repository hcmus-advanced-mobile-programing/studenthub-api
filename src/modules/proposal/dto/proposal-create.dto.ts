import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DisableFlag, StatusFlag } from 'src/common/common.enum';

export class ProposalCreateDto {
  @ApiProperty({ description: 'Project ID', type: 'bigint', required: true })
  @IsNotEmpty()
  projectId: number | string;

  @ApiProperty({ description: 'Student ID', type: 'bigint', required: true })
  @IsNotEmpty()
  studentId: number | string;

  @ApiProperty({ description: 'Cover Letter', required: false })
  @IsNotEmpty()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ description: 'Status Flag', example: StatusFlag.Offer, default: StatusFlag.Waitting })
  statusFlag: StatusFlag = StatusFlag.Waitting;

  @ApiProperty({ description: 'Disable Flag', example: DisableFlag.Enable })
  disableFlag: DisableFlag;
}
