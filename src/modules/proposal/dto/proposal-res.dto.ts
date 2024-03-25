import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from 'src/modules/student/entities/student.entity';
import { Project } from 'src/modules/project/project.entity';
import { StatusFlag } from 'src/common/common.enum';

export class ProposalResDto {
  @ApiProperty()
  readonly id: string | number;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  project?: Project;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  student?: Student;

  @IsString()
  @ApiProperty()
  coverLetter?: string;

  @IsNumber()
  @ApiProperty()
  statusFlag: StatusFlag;
}
