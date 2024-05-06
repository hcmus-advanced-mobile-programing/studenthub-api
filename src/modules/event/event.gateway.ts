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
}
