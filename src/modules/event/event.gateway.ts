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

@Injectable()
@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('SEND_MESSAGE')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data): void {
    const { project_id: projectId, content } = data;

    this.server.to(projectId).emit('SEND_MESSAGE', { content });

    this.sendNotificationToUidByProject(client.id, projectId, content);
  }

  sendNotificationToUidByProject(clientId: string, projectId: string, content: string): void {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(socket: Socket) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handleConnection(socket: Socket): Promise<void> {
    try {
      const { email, id } = await this.jwtService.verify(socket.handshake.headers.authorization.split(' ')[1]);
      const { project_id } = socket.handshake.query;

      socket.data = { email, id };
      if (project_id) await socket.join(project_id);
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
