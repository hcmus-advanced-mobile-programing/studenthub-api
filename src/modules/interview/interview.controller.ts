import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewUpdateDto } from 'src/modules/interview/dto/interview-update.dto';
import { InterviewService } from 'src/modules/interview/interview.service';

@ApiTags('interview')
@Controller('api/interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  async createInterview(@Body() interview: InterviewCreateDto) {
    return await this.interviewService.create(interview);
  }

  @Patch(':id')
  async updateInterview(@Param('id') id: number, @Body() interview: InterviewUpdateDto) {
    return await this.interviewService.update(id, interview);
  }

  @Get()
  async findAllInterviews() {
    return await this.interviewService.findAll();
  }

  @Get(':id')
  async findInterviewById(@Param('id') id: number) {
    return await this.interviewService.findById(id);
  }

  @Delete(':id')
  async deleteInterviewById(@Param('id') id: number) {
    return await this.interviewService.delete(id);
  }

  @Patch(':id/disable')
  async disableInterviewById(@Param('id') id: number) {
    return await this.interviewService.disable(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewUpdateDto } from 'src/modules/interview/dto/interview-update.dto';
import { InterviewService } from 'src/modules/interview/interview.service';

@ApiTags('interview')
@Controller('api/interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  async createInterview(@Body() interview: InterviewCreateDto) {
    return await this.interviewService.create(interview);
  }

  @Patch(':id')
  async updateInterview(@Param('id') id: number, @Body() interview: InterviewUpdateDto) {
    return await this.interviewService.update(id, interview);
  }

  @Get()
  async findAllInterviews() {
    return await this.interviewService.findAll();
  }

  @Get(':id')
  async findInterviewById(@Param('id') id: number) {
    return await this.interviewService.findById(id);
  }

  @Delete(':id')
  async deleteInterviewById(@Param('id') id: number) {
    return await this.interviewService.delete(id);
  }

  @Patch(':id/disable')
  async disableInterviewById(@Param('id') id: number) {
    return await this.interviewService.disable(id);
  }
}
