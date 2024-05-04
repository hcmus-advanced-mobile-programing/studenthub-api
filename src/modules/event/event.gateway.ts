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
import { Repository } from 'typeorm';
import * as Queue from 'bull';
import { checkObjectMatchesDto } from 'src/utils/validators/dto.validator';
import { MessageDto } from 'src/modules/event/dto/message.dto';
import { MessageService } from 'src/modules/message/message.service';
import { UserService } from 'src/modules/user/user.service';
import { InterviewDto } from 'src/modules/event/dto/interview.dto';
import { NotificationService } from 'src/modules/notification/notification.service';
import { _InterviewUpdateDto } from 'src/modules/event/dto/interview-update.dto';
import { InterviewService } from 'src/modules/interview/interview.service';
import { Message } from 'src/modules/message/message.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';
import { NotifyFlag, TypeNotifyFlag, DisableFlag } from 'src/common/common.enum';

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
  private updateInterviewQueue: Queue.Queue;
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(MeetingRoom)
    private readonly meetingRoomRepository: Repository<MeetingRoom>,
    private readonly jwtService: JwtService,
    private messageService: MessageService,
    private userService: UserService,
    private notificationService: NotificationService,
    private interviewService: InterviewService,
  ) {
    // Create message queue and process message
    this.messageQueue = new Queue('messageQueue');
    this.messageQueue
      .process(async (job: Queue.Job<MessageDto>, done) => {
        const { projectId, content, senderId, receiverId, messageFlag, senderSocketId } = job.data;

        // Create message in database
        const resultAdd = await messageService.createMessage({ projectId, content, senderId, receiverId, messageFlag });

        if (!resultAdd) {
          this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in message queue' });
          return done();
        }

        const messageId = resultAdd;

        await this.notificationService.createNotification({
          senderId: senderId,
          receiverId: receiverId,
          messageId: messageId,
          content: `New message created`,
          notifyFlag: NotifyFlag.Unread,
          typeNotifyFlag: TypeNotifyFlag.Chat,
          title: `New message is sent by user ${senderId}`,
        });

        const notification = await this.notificationService.findOneByReceiverId(receiverId, messageId);

        // Send message to clients
        this.server
          .to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`])
          .emit(`RECEIVE_MESSAGE`, { notification });

        // Send notification to receiver
        this.server.emit(`NOTI_${receiverId}`, { notification });
        done();
      })
      .catch((error) => {
      });

    this.messageQueue.on('error', (error) => {
    });

    // Create interview queue and process interview
    this.interviewQueue = new Queue('interviewQueue');
    this.interviewQueue
      .process(async (job: Queue.Job<InterviewDto>, done) => {

        console.log('interviewQueue');

        const { title, content, startTime, endTime, projectId, senderId, receiverId, senderSocketId, meeting_room_code, meeting_room_id, expired_at } = job.data;

        const checkMeetingExist = await this.meetingRoomRepository.findOne({
          where: [
            { meeting_room_code: meeting_room_code },
            { meeting_room_id: meeting_room_id }
          ]
        });

        if (checkMeetingExist) {
          if (checkMeetingExist.meeting_room_code === meeting_room_code) {
            this.server.to(senderSocketId).emit('ERROR', { content: 'Meeting room code already exists' });
          } else {
            this.server.to(senderSocketId).emit('ERROR', { content: 'Meeting room id already exists' });
          }
          return done();
        }

        const messageId = await this.interviewService.create({ title, content, startTime, endTime, projectId, senderId, receiverId, meeting_room_code, meeting_room_id, expired_at });

        console.log('messageId');
        console.log(messageId);

        const notification = await this.notificationService.findOneByReceiverId(receiverId, messageId);

        this.server.to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`]).emit(`RECEIVE_INTERVIEW`, { notification });
        this.server.emit(`NOTI_${receiverId}`, { notification });
        done();
      })
      .catch((error) => {
        console.log('error', error);
      });

    this.interviewQueue.on('error', (error) => {
    });

    // Update interview queue and process interview
    this.updateInterviewQueue = new Queue('updateInterviewQueue');
    this.updateInterviewQueue
      .process(async (job: Queue.Job<_InterviewUpdateDto>, done) => {
        const { interviewId, senderId, receiverId, projectId, title, startTime, endTime, senderSocketId, updateAction, deleteAction } = job.data;
        const message = await this.messageRepository.findOneBy({ interviewId: interviewId });
        const messageId = message.id;
        const sender = await userService.findOne({ id: senderId });
        let notification: any;

        const checkInterviewExist = await this.interviewService.findById(Number(interviewId));
        if (!checkInterviewExist || checkInterviewExist.disableFlag === DisableFlag.Disable) {
          this.server.to(senderSocketId).emit('ERROR', { content: 'The interview does not exist' });
          return done();
        }

        if (deleteAction == true) {
          const resultDel = this.interviewService.disable(Number(interviewId));
          if (!resultDel) {
            this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in interview queue' });
            return done();
          }

          await this.notificationService.createNotification({
            senderId: senderId,
            receiverId: receiverId,
            messageId: messageId,
            content: `Interview deleted`,
            notifyFlag: NotifyFlag.Unread,
            typeNotifyFlag: TypeNotifyFlag.Interview,
            title: `Interview deleted from ${sender.fullname}`,
          });
          notification = await this.notificationService.findOneByContent(receiverId, messageId, 'Interview deleted');

          this.server.to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`]).emit(`RECEIVE_INTERVIEW`, { title: `Interview deleted from ${sender.fullname}`, projectId, senderId, receiverId, messageId });
          this.server.emit(`NOTI_${receiverId}`, { title: `Interview deleted from ${sender.fullname}`, projectId, senderId, receiverId, messageId });
          done();
        }

        if (updateAction == true) {
          const resultAdd = this.interviewService.update(Number(interviewId), { title, startTime, endTime });
          if (!resultAdd) {
            this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in interview queue' });
            return done();
          }

          await this.notificationService.createNotification({
            senderId: senderId,
            receiverId: receiverId,
            messageId: messageId,
            content: `Interview updated`,
            notifyFlag: NotifyFlag.Unread,
            typeNotifyFlag: TypeNotifyFlag.Interview,
            title: `Interview updated from ${sender.fullname}`,
          });
          notification = await this.notificationService.findOneByContent(receiverId, messageId, 'Interview updated');

          this.server.to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`]).emit(`RECEIVE_INTERVIEW`, { notification });
          this.server.emit(`NOTI_${receiverId}`, { notification });
          done();
        }
      })
      .catch((error) => {
      });

    this.updateInterviewQueue.on('error', (error) => {
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(socket: Socket) {
  }

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
        .add({ projectId, content, senderId, receiverId, messageFlag, senderSocketId: client.id })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
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

      const { title, content, startTime, endTime, disableFlag, projectId, senderId, receiverId, meeting_room_code, meeting_room_id, expired_at } = data;

      this.interviewQueue
        .add({ title, content, startTime, endTime, disableFlag, projectId, senderId, receiverId, senderSocketId: client.id, meeting_room_code, meeting_room_id, expired_at })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in interview queue' });
    }
  }

  @SubscribeMessage('UPDATE_INTERVIEW')
  async updateInterview(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {
    try {
      const checkValidate = await checkObjectMatchesDto(data, _InterviewUpdateDto);

      if (!checkValidate) {
        throw new Error('Invalid data');
      }

      const { interviewId, senderId, receiverId, projectId, title, startTime, endTime, updateAction, deleteAction } = data;

      this.updateInterviewQueue
        .add({ interviewId, senderId, receiverId, projectId, title, startTime, endTime, senderSocketId: client.id, updateAction, deleteAction })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in update interview queue' });
    }
  }
}
