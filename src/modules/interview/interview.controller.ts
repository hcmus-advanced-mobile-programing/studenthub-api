import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewUpdateDto } from 'src/modules/interview/dto/interview-update.dto';
import { InterviewService } from 'src/modules/interview/interview.service';

@ApiTags('interview')
@Controller('api/interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Auth()
  @Post()
  async createInterview(@Body() interview: InterviewCreateDto) {
    return await this.interviewService.create(interview);
  }

  @Auth()
  @Patch(':id')
  async updateInterview(@Param('id') id: number, @Body() interview: InterviewUpdateDto) {
    return await this.interviewService.update(id, interview);
  }

  @Auth()
  @Get()
  async findAllInterviews() {
    return await this.interviewService.findAll();
  }

  @Auth()
  @Get(':id')
  async findInterviewById(@Param('id') id: number) {
    return await this.interviewService.findById(id);
  }

  @Auth()
  @Delete(':id')
  async deleteInterviewById(@Param('id') id: number) {
    return await this.interviewService.delete(id);
  }

  @Auth()
  @Patch(':id/disable')
  async disableInterviewById(@Param('id') id: number) {
    return await this.interviewService.disable(id);
  }

  @Auth()
  @Get('user/:userId')
  async searchUserId(@Param('userId') userId: number) {
    return await this.interviewService.searchUserId(userId);
  }
}