import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { MessageResDto } from 'src/modules/message/dto/message-res.dto';
import { Message } from 'src/modules/message/message.entity';
import { MessageService } from 'src/modules/message/message.service';
import { CreateStudentProfileDto } from 'src/modules/student/dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from 'src/modules/student/dto/update-student-profile.dto';
import { StudentProfileService } from 'src/modules/student/student.service';
import { TechStack } from 'src/modules/techStack/techStack.entity';

@ApiTags('message')
@Controller('api/message')
export class MessageController {
  constructor(private messageSerive: MessageService) {}

  @Auth()
  @Get(':projectId')
  async searchProjectId(@Param('projectId') projectId: number): Promise<MessageResDto[]> {
    return await this.messageSerive.searchProjectId(projectId);
  }

  @Auth()
  @Get(':projectId/user/:userId')
  async searchProjectUserId(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number
  ): Promise<MessageResDto[]> {
    return await this.messageSerive.searchProjectUserId(projectId, userId);
  }

  @Auth()
  @Get('')
  async searchUserId(): Promise<MessageResDto[]> {
    return await this.messageSerive.searchUserId();
  }
}
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { MessageGetDto } from 'src/modules/message/dto/message_get.dto';
import { MessageGet } from 'src/modules/message/interface/message_get.interface';
import { MessageService } from 'src/modules/message/message.service';

@ApiTags('message-chat')
@Controller('api/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Auth()
  @Get()
  findMessage(@Param() messageGetDto: MessageGetDto): Promise<MessageGet> {
    return this.messageService.findMessage(messageGetDto);
  }

  // @Auth()
  // @Delete(':id')
  // deleteMessage(@Param('id') id: string) {
  //   return id;
  // }

  // @Auth()
  // @Put(':id')
  // updateMessage(@Param('id') id: string, @Body() message: any) {
  //   return message;
  // }
}
