import { Body, Controller, Param, Post, Put, Get, ValidationPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { MessageResDto } from 'src/modules/message/dto/message-res.dto';
import { MessageGetDto } from 'src/modules/message/dto/message_get.dto';
import { MessageService } from 'src/modules/message/message.service';
import { MessageCreateDto } from 'src/modules/message/dto/message-create.dto';

@ApiTags('message')
@Controller('api/message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Auth()
  @Get(':projectId')
  async searchProjectId(@Param('projectId') projectId: number): Promise<MessageResDto[]> {
    return await this.messageService.searchProjectId(projectId);
  }

  @Auth()
  @Get(':projectId/user/:userId')
  async searchProjectUserId(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number
  ): Promise<MessageResDto[]> {
    return await this.messageService.searchProjectUserId(projectId, userId);
  }

  @Auth()
  @Get('')
  async searchUserId(): Promise<MessageResDto[]> {
    return await this.messageService.searchUserId();
  }

  //TODO: Group seminar by project
  @Auth()
  @Get('get/page')
  findMessage(@Query(new ValidationPipe()) messageGetDto: MessageGetDto): any {
    return this.messageService.findMessage(messageGetDto);
  }

  @Auth()
  @Post('sendMessage')
  sendMessage(@Body() data: MessageCreateDto): Promise<void>{
    return this.messageService.createMessage(data);
  }
}
