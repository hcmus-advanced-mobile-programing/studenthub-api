import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Message } from 'src/modules/message/message.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { MessageGetDto } from 'src/modules/message/dto/message_get.dto';
import { MessageGet } from 'src/modules/message/interface/message_get.interface';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findMessage(messageGetDto: MessageGetDto): Promise<MessageGet> {
    this.logger.debug(`findMessage: ${JSON.stringify(messageGetDto)}`);

    const userId = this.httpContext.getUser()?.id;
    if (!userId) {
      throw new BadRequestException(`User not found in the request context.`);
    }

    const listFilterId = [messageGetDto.projectId, messageGetDto.receiverId, userId];
    const page = messageGetDto.page || 1;
    const pageSize = messageGetDto.pageSize || 10;

    // find message with limit page and pageSize
    const message = await this.messageRepository.find({
      where: {
        projectId: messageGetDto.projectId,
        receiverId: In(listFilterId),
        senderId: In(listFilterId),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // count total message
    const totalMessages = await this.messageRepository.count({
      where: {
        projectId: messageGetDto.projectId,
        receiverId: In(listFilterId),
        senderId: In(listFilterId),
      },
    });

    // calculate total page
    const totalPage = Math.ceil(totalMessages / pageSize);

    return {
      messages: message,
      page,
      totalPage,
      pageSize,
    };
  }

  async createMessage(data: any): Promise<string> {
    const senderId = data.senderId;
    const receiverId = data.receiverId;
    const projectId = data.projectId;

    try {
      await this.messageRepository.create({
        senderId,
        receiverId,
        projectId,
        content: data.content,
        messageFlag: data.messageFlag,
      });
    } catch (Exception) {
      this.logger.error(`Error when create message: ${Exception}`);
      throw new BadRequestException(`Error when create message`);
    }

    return 'success';
  }

  async deleteMessage(id: string): Promise<string> {
    this.logger.debug(`deleteMessage: ${id}`);

    const userId = this.httpContext.getUser()?.id;
    if (!userId) {
      throw new BadRequestException(`User not found in the request context.`);
    }

    await this.messageRepository.delete({ id, senderId: userId });

    return 'success';
  }

  // async updateMessage(data: s): Promise<any> {
  //   this.logger.debug(`updateMessage: ${id}`);

  //   const userId = this.httpContext.getUser()?.id;
  //   if (!userId) {
  //     throw new BadRequestException(`User not found in the request context.`);
  //   }
  // }
}
