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

@Injectable()
@WebSocketGateway(parseInt(process.env.SOCKET_PORT, 10), {cors: { origin: '*' }})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server;
  private messageQueue: Queue.Queue;
  private interviewQueue: Queue.Queue;
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly jwtService: JwtService,
    private messageService: MessageService,
    private userService: UserService
  ) {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(socket: Socket) {}

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
      console.log('Unauthorized connection');
      socket.disconnect();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  // Listen for SEND_MESSAGE event
  @SubscribeMessage('SEND_MESSAGE')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {
    try {
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

  // sendNotificationToUidByProject(clientId: string, projectId: string, content: string): void {
  //   try {
  //     const rooms = this.server.sockets.adapter.rooms;
  //     const socketsInRooms = rooms.get(projectId);

  //     for (const socketId of socketsInRooms) {
  //       if (socketId !== clientId) {
  //         const socketDetail = this.server.sockets.sockets.get(socketId);

  //         if (socketDetail) {
  //           this.server.emit(`NOTI_${socketDetail.data.id}`, {
  //             content,
  //             noti: true,
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}
