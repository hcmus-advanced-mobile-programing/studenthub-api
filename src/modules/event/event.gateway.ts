import { Injectable } from '@nestjs/common';
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

@Injectable()
@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server;
  private messageQueue: Queue.Queue;

  constructor(private readonly jwtService: JwtService) {
    this.messageQueue = new Queue('messageQueue');

    this.messageQueue
      .process(
        (
          job: Queue.Job<{
            projectId: string;
            content: string;
            clientId: string;
          }>, 
          done
        ) => {
          const { projectId, content, clientId } = job.data;

          this.server.to(projectId.toString()).emit('SEND_MESSAGE', { content });
          this.sendNotificationToUidByProject(clientId, projectId.toString(), content);

          done();
        }
      )
      .catch((error) => {
        throw new Error(error);
      });

    this.messageQueue.on('error', (error) => {
      console.error('Error occurred in message queue: ', error);
    });
  }

  @SubscribeMessage('SEND_MESSAGE')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data): void {
    try {
      const { project_id: projectId, content } = data;

      this.messageQueue.add({ projectId, content, clientId: client.id }).catch((error) => {
        throw new Error(error);
      });
    } catch (error) {
      console.error('Error occurred in message queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in message queue' });
    }
  }

  sendNotificationToUidByProject(clientId: string, projectId: string, content: string): void {
    try {
      const rooms = this.server.sockets.adapter.rooms;
      const socketsInRooms = rooms.get(projectId);

      for (const socketId of socketsInRooms) {
        if (socketId !== clientId) {
          const socketDetail = this.server.sockets.sockets.get(socketId);

          if (socketDetail) {
            this.server.emit(`NOTI_${socketDetail.data.id}`, {
              content,
              noti: true,
            });
          }
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(socket: Socket) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handleConnection(socket: Socket): Promise<void> {
    try {
      const { email, id } = await this.jwtService.verify(socket.handshake.headers.authorization.split(' ')[1]);
      const { project_id } = socket.handshake.query;

      console.log('Email: ', email, 'Id: ', id, 'Project id: ', project_id);

      socket.data = { email, id };
      if (project_id) await socket.join(project_id.toString());
    } catch (error) {
      console.log('Unauthorized connection');
      socket.disconnect();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handleDisconnect(socket: Socket) {
    socket.disconnect();
  }
}
