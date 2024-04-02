import { ApiProperty } from '@nestjs/swagger';
import { User } from '@sentry/node';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ICommonAttr, IDAndName } from 'src/common/common.dto';
import { CompanySize, MessageFlag } from 'src/common/common.enum';
import { InterviewResDto } from 'src/modules/interview/dto/interview-res.dto';
import { Interview } from 'src/modules/interview/interview.entity';

export interface MessageResDto extends ICommonAttr {
  sender: IDAndName;
  receiver: IDAndName;
  interview?: InterviewResDto | null;
  content: string;
  messageFlag: MessageFlag;
}
