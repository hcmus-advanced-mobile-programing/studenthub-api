import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { MessageService } from 'src/modules/message/message.service';
import { UserService } from 'src/modules/user/user.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { _InterviewUpdateDto } from 'src/modules/event/dto/interview-update.dto';
import { NotificationDto } from 'src/modules/event/dto/notification.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private messageQueue: Queue.Queue;
  private notificationQueue: Queue.Queue;
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {
    // Create message queue and process message
    // this.messageQueue = new Queue('messageQueue');
    // this.messageQueue
    //   .process(async (job: Queue.Job<MessageDto>, done) => {
    //     const { projectId, content, senderId, receiverId, messageFlag, senderSocketId } = job.data;

    //     // Create message in database
    //     const resultAdd = await messageService.createMessage({ projectId, content, senderId, receiverId, messageFlag });

    //     if (!resultAdd) {
    //       this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in message queue' });
    //       return done();
    //     }

    //     const messageId = resultAdd;

    //     await this.notificationService.createNotification({
    //       senderId: senderId,
    //       receiverId: receiverId,
    //       messageId: messageId,
    //       content: `New message created`,
    //       notifyFlag: NotifyFlag.Unread,
    //       typeNotifyFlag: TypeNotifyFlag.Chat,
    //       title: `New message is sent by user ${senderId}`,
    //       proposalId: null,
    //     });

    //     const notification = await this.notificationService.findOneByReceiverId(receiverId, messageId);

    //     // Send message to clients
    //     this.server
    //       .to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`])
    //       .emit(`RECEIVE_MESSAGE`, { notification });

    //     // Send notification to receiver
    //     this.server.emit(`NOTI_${receiverId}`, { notification });
    //     done();
    //   })
    //   .catch((error) => { });

    // this.messageQueue.on('error', (error) => { });

    // Create notification queue and process notification
    this.notificationQueue = new Queue('notificationQueue');
    this.notificationQueue
      .process(async (job: Queue.Job<NotificationDto>, done) => {
        const { receiverId, notificationId } = job.data;

        const notification = await this.notificationService.findOneById(notificationId);

        this.server.emit(`NOTI_${receiverId}`, { notification });
        done();
      })
      .catch((error) => {
        console.log('process error', error);
      });

    this.notificationQueue.on('error', (error) => {
      console.log('on error', error);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(socket: Socket) { }

  // Handle authorized connection
  async handleConnection(socket: Socket): Promise<void> {
    try {
      // Verify token
      const { email, id } = await this.jwtService.verify(socket.handshake.headers.authorization.split(' ')[1]);
      const { project_id } = socket.handshake.query;

      socket.data = { email, id };

      // Join room
      if (project_id) await socket.join(`${project_id}_${id}`);
    } catch (error) {
      console.log(error);
      socket.disconnect();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  async sendNotification(data: NotificationDto): Promise<void> {
    await this.notificationQueue.add(data).catch((error) => {
      throw new Error(error);
    });
  }

  // Listen for SEND_MESSAGE event
  // @SubscribeMessage('SEND_MESSAGE')
  // async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {
  //   try {
  //     const checkValidate = await checkObjectMatchesDto(data, MessageDto);

  //     if (!checkValidate) {
  //       throw new Error('Invalid data');
  //     }

  //     const { projectId, content, receiverId, senderId, messageFlag } = data;

  //     // Add task to message queue
  //     this.messageQueue
  //       .add({ projectId, content, senderId, receiverId, messageFlag, senderSocketId: client.id })
  //       .catch((error) => {
  //         throw new Error(error);
  //       });
  //   } catch (error) {
  //     this.server.to(client.id).emit('ERROR', { content: 'Error occurred in message queue' });
  //   }
  // }
}
