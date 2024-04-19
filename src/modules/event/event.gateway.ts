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
import { NotificationDto } from 'src/modules/event/dto/notification.dto';
import { NotificationService } from 'src/modules/notification/notification.service';

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
      .process(async (job: Queue.Job, done) => {
        console.log('Interview processing');
        await done();
      })
      .catch((error) => {
        console.error(error);
      });

    this.interviewQueue.on('error', (error) => {
      console.error('Error occurred in interview queue: ', error);
    });

    // Create message queue and process message
    this.notificationQueue = new Queue('notificationQueue');
    this.notificationQueue
      .process(async (job: Queue.Job<NotificationDto>, done) => {
        const { receiverId, senderId, messageId, title, notifyFlag, typeNotifyFlag, content } = job.data;

        // Create notification in database
        const resultAdd = await notificationService.createNotification({ receiverId, senderId, messageId, title, notifyFlag, typeNotifyFlag, content });

        if (!resultAdd) {
          console.error(senderId, 'Error occurred while adding notification');
          // Send error to sender
          this.server.to(senderId.toString()).emit('ERROR', { content: 'Error occurred in notification queue' });
          return done();
        }

        // Send notification to clients
        this.server
          .to([`${senderId}`, `${receiverId}`])
          .emit(`RECEIVE_NOTIFICATION`, { content, senderId, receiverId, typeNotifyFlag });
        done();
      })
      .catch((error) => {
        console.error(error);
      });

    this.notificationQueue.on('error', (error) => {
      console.error('Error occurred in notification queue: ', error);
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

      console.log(socket.handshake.headers.authorization.split(' ')[1]);
      // Verify token
      const { email, id } = await this.jwtService.verify(socket.handshake.headers.authorization.split(' ')[1]);
      console.log(email);
      console.log(id);
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
      await setTimeout(() => {
        console.log('Schedule interview: ', data);
      });

      this.interviewQueue.add({}).catch((error) => {
        throw new Error(error);
      });
    } catch (error) {
      console.error('Error occurred in message queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in message queue' });
    }
  }

  @SubscribeMessage('SEND_NOTIFICATION')
  async sendNotificationToUser(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {

    try {
      console.log('handleNotification');

      console.log(data);

      const checkValidate = await checkObjectMatchesDto(data, NotificationDto);

      if (!checkValidate) {
        throw new Error('Invalid data');
      }

      const { receiverId, senderId, messageId, title, notifyFlag, typeNotifyFlag, content } = data;

      // Add task to notification queue
      this.notificationQueue
        .add({ receiverId, senderId, messageId, title, notifyFlag, typeNotifyFlag, content })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error('Error occurred in notification queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in notification queue' });
    }
  }
}
