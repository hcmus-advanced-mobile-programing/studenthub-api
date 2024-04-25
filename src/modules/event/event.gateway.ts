import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import * as Queue from 'bull';
import { checkObjectMatchesDto } from 'src/utils/validators/dto.validator';
import { MessageDto } from 'src/modules/event/dto/message.dto';
import { MessageService } from 'src/modules/message/message.service';
import { UserService } from 'src/modules/user/user.service';
import { InterviewDto } from 'src/modules/event/dto/interview.dto';
import { NotificationService } from 'src/modules/notification/notification.service';
import { InterviewCreateDto } from 'src/modules/interview/dto/interview-create.dto';
import { InterviewService } from 'src/modules/interview/interview.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server;
  private messageQueue: Queue.Queue;
  private interviewQueue: Queue.Queue;
  private notificationQueue: Queue.Queue;
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly jwtService: JwtService,
    private messageService: MessageService,
    private userService: UserService,
    private notificationService: NotificationService,
    private interviewService: InterviewService
  ) {
    console.log('constructor');
    // Create message queue and process message
    this.messageQueue = new Queue('messageQueue');
    this.messageQueue
      .process(async (job: Queue.Job<MessageDto>, done) => {
        const { projectId, content, senderId, receiverId, messageFlag, senderSocketId } = job.data;

        // Create message in database
        const resultAdd = await messageService.createMessage({ projectId, content, senderId, receiverId, messageFlag });

        if (!resultAdd) {
          console.error(senderSocketId, 'Error occurred while adding message');
          // Send error to sender
          this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in message queue' });
          return done();
        }

        const sender = await userService.findOne({ id: senderId });

        // Send message to clients
        this.server
          .to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`])
          .emit(`RECEIVE_MESSAGE`, { content, senderId, receiverId, messageFlag });

        // Send notification to receiver
        this.server.emit(`NOTI_${receiverId}`, { content, title: `New message from ${sender.fullname}`, messageFlag });
        done();
      })
      .catch((error) => {
        console.error(error);
      });

    this.messageQueue.on('error', (error) => {
      console.error('Error occurred in message queue: ', error);
    });

    // Create interview queue and process interview
    this.interviewQueue = new Queue('interviewQueue');
    this.interviewQueue
      .process(async (job: Queue.Job<InterviewDto>, done) => {
        const { title, startTime, endTime, disableFlag, projectId, senderId, receiverId, senderSocketId} = job.data;
        const resultAdd = this.interviewService.create({title, startTime, endTime, disableFlag, projectId, senderId, receiverId});

        if (!resultAdd) {
          console.error(senderSocketId, 'Error occurred while adding interview');
          // Send error to sender
          this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in interview queue' });
          return done();
        }

        const sender = await userService.findOne({ id: senderId });
        this.server.emit(`RECEIVE_INTERVIEW`, { title, senderId, receiverId, projectId });
        // Send notification to receiver
        this.server.emit(`NOTI_${receiverId}`, { title: `New interview created from ${sender.fullname}`, projectId, senderId, receiverId });
        done();
      })
      .catch((error) => {
        console.error(error);
      });

    this.interviewQueue.on('error', (error) => {
      console.error('Error occurred in interview queue: ', error);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(socket: Socket) {
    console.log('afterInit');
  }

  // Handle authorized connection
  async handleConnection(socket: Socket): Promise<void> {
    try {
      console.log('handleConnection');

      // Verify token
      const { email, id } = await this.jwtService.verify(socket.handshake.headers.authorization.split(' ')[1]);
      const { project_id } = socket.handshake.query;

      socket.data = { email, id };

      // Join room
      if (project_id) await socket.join(`${project_id}_${id}`);
    } catch (error) {
      console.log('Unauthorized connection');
      socket.disconnect();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handleDisconnect(socket: Socket) {
    console.log('handleDisconnect');

    socket.disconnect();
  }

  // Listen for SEND_MESSAGE event
  @SubscribeMessage('SEND_MESSAGE')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {
    try {
      console.log('handleMessage');

      const checkValidate = await checkObjectMatchesDto(data, MessageDto);

      if (!checkValidate) {
        throw new Error('Invalid data');
      }

      const { projectId, content, receiverId, senderId, messageFlag } = data;

      // Add task to message queue
      this.messageQueue
        .add({ projectId, content, senderSocketId: client.id, receiverId, senderId, messageFlag })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error('Error occurred in message queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in message queue' });
    }
  }

  @SubscribeMessage('SCHEDULE_INTERVIEW')
  async handleScheduleInterview(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {
    try {
      const checkValidate = await checkObjectMatchesDto(data, InterviewDto);

      if (!checkValidate) {
        throw new Error('Invalid data');
      }

      const { title, startTime, endTime, disableFlag, projectId, senderId, receiverId } = data;
      const clientId = client.id;

      this.interviewQueue
        .add({ title, startTime, endTime, disableFlag, projectId, senderId, receiverId, clientId})
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error('Error occurred in message queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in message queue' });
    }
  }
}
