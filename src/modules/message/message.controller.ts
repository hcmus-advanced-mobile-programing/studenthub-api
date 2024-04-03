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
