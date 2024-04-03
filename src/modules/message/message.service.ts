import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/common.enum';
import { Company } from 'src/modules/company/company.entity';
import { MessageResDto } from 'src/modules/message/dto/message-res.dto';
import { Message } from 'src/modules/message/message.entity';
import { Student } from 'src/modules/student/student.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async searchProjectId(projectId: number): Promise<MessageResDto[] | any> {
    const userId = this.httpContext.getUser().id;

    const receiverMessages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .leftJoinAndSelect('message.interview', 'interview')
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'sender.id',
        'sender.fullname',
        'receiver.id',
        'receiver.fullname',
        'interview',
      ])
      .where('message.projectId = :projectId', { projectId })
      .andWhere('message.senderId = :userId', { userId })
      .distinct(true)
      .getMany();

    const senderMessages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .leftJoinAndSelect('message.interview', 'interview')
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'sender.id',
        'sender.fullname',
        'receiver.id',
        'receiver.fullname',
        'interview',
      ])
      .where('message.projectId = :projectId', { projectId })
      .andWhere('message.receiverId = :userId', { userId })
      .distinct(true)
      .getMany();

    const allMessages = [...receiverMessages, ...senderMessages];

    const uniqueMessagesMap = new Map<number | string, MessageResDto>();
    allMessages.forEach((message) => {
      const existingMessage = uniqueMessagesMap.get(
        message.receiver.id === userId ? message.sender.id : message.receiver.id
      );
      if (!existingMessage || message.createdAt > existingMessage.createdAt) {
        uniqueMessagesMap.set(message.receiver.id === userId ? message.sender.id : message.receiver.id, message);
      }
    });

    const uniqueMessages = Array.from(uniqueMessagesMap.values());

    return uniqueMessages;
  }

  async searchProjectUserId(projectId: number, userId: number): Promise<MessageResDto[] | any> {
    const loginUserId = this.httpContext.getUser().id;

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .leftJoinAndSelect('message.interview', 'interview')
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'sender.id',
        'sender.fullname',
        'receiver.id',
        'receiver.fullname',
        'interview',
      ])
      .where('message.projectId = :projectId', { projectId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('message.senderId = :userId', { userId })
            .andWhere('message.receiverId = :loginUserId', { loginUserId: loginUserId })
            .orWhere(
              new Brackets((qb) => {
                qb.where('message.senderId = :loginUserId', { loginUserId: loginUserId }).andWhere(
                  'message.receiverId = :userId',
                  { userId }
                );
              })
            );
        })
      )
      .orderBy('message.createdAt', 'ASC')
      .distinct(true)
      .getMany();

    return messages;
  }

  async searchUserId(): Promise<MessageResDto[] | any> {
    const loginUserId = this.httpContext.getUser().id;

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.interview', 'interview')
      .leftJoinAndSelect('message.project', 'project')
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'sender.id',
        'sender.fullname',
        'receiver.id',
        'receiver.fullname',
        'interview',
        'project',
      ])
      .andWhere(
        new Brackets((qb) => {
          qb.where('message.receiverId = :loginUserId', { loginUserId: loginUserId }).orWhere(
            'message.senderId = :loginUserId',
            { loginUserId: loginUserId }
          );
        })
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    const groupedMessages = messages.reduce((acc, message) => {
      const projectId = message.project.id;
      if (!acc[projectId]) {
        acc[projectId] = {
          project: message.project,
          messages: [],
        };
      }
      message.project = undefined;
      acc[projectId].messages.push(message);
      return acc;
    }, {});

    const groupedMessagesArray = Object.values(groupedMessages);

    return groupedMessagesArray;
  }
}
