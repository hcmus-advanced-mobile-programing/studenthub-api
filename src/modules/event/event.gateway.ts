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
import { Interview } from 'src/modules/interview/interview.entity';
import { MeetingRoom } from 'src/modules/meeting-room/meeting-room.entity';
import { NotifyFlag, TypeNotifyFlag } from 'src/common/common.enum';
import { Console } from 'console';

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
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
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

        // Send message to clients
        this.server
          .to([`${projectId}_${senderId}`, `${projectId}_${receiverId}`])
          .emit(`RECEIVE_MESSAGE`, { content, senderId, receiverId, messageFlag, messageId });

        // Send notification to receiver
        this.server.emit(`NOTI_${receiverId}`, { content, title: `New message from ${sender.fullname}`, messageFlag, messageId });
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
        const { title, startTime, endTime, projectId, senderId, receiverId, senderSocketId, meeting_room_code, meeting_room_id, expired_at} = job.data;
        

        const checkCode = await this.meetingRoomRepository.findOneBy({meeting_room_code: meeting_room_code});
        if (checkCode){
          console.error(senderSocketId, 'Meeting room code already exist');    
          this.server.to(senderSocketId).emit('ERROR', { content: 'Meeting room code already exist' });
          return done();
        }

        const checkId = await this.meetingRoomRepository.findOneBy({meeting_room_id: meeting_room_id});
        if (checkId){
          console.error(senderSocketId, 'Meeting room id already exist');
          this.server.to(senderSocketId).emit('ERROR', { content: 'Meeting room id already exist' });
          return done();
        }

        const resultAdd = this.interviewService.create({title, startTime, endTime, projectId, senderId, receiverId, meeting_room_code, meeting_room_id, expired_at});

        if (!resultAdd) {
          console.error(senderSocketId, 'Error occurred while adding interview');
          this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in interview queue' });
          return done();
        }

        const interviewId = (await resultAdd).id;

        const sender = await userService.findOne({ id: senderId });
        this.server.emit(`RECEIVE_INTERVIEW`, { title, senderId, receiverId, interviewId, projectId });
        this.server.emit(`NOTI_${receiverId}`, { title: `New interview created from ${sender.fullname}`, interviewId, projectId, senderId, receiverId, meeting_room_code, meeting_room_id });
        done();
      })
      .catch((error) => {
        console.error(error);
      });

    this.interviewQueue.on('error', (error) => {
      console.error('Error occurred in interview queue: ', error);
    });

    // Update interview queue and process interview
    this.updateInterviewQueue = new Queue('updateInterviewQueue');
    this.updateInterviewQueue
      .process(async (job: Queue.Job<_InterviewUpdateDto>, done) => {
        const { interviewId, senderId, receiverId, projectId, title, startTime, endTime, senderSocketId} = job.data;

        const checkInterviewExist = await this.interviewService.findById(Number(interviewId));
        if (!checkInterviewExist){
          console.error(senderSocketId, 'The interview does not exist');
          // Send error to sender
          this.server.to(senderSocketId).emit('ERROR', { content: 'The interview does not exist' });
          return done();
        }
        const resultAdd = this.interviewService.update(Number(interviewId), {title, startTime, endTime});
        console.log(resultAdd);
        if (!resultAdd) {
          console.error(senderSocketId, 'Error occurred while adding interview');
          // Send error to sender
          this.server.to(senderSocketId).emit('ERROR', { content: 'Error occurred in interview queue' });
          return done();
        }

        const sender = await userService.findOne({ id: senderId });
        this.server.emit(`RECEIVE_INTERVIEW`, { title, senderId, receiverId, projectId });
        // Send notification to receiver
        this.server.emit(`NOTI_${receiverId}`, { title: `Interview updated from ${sender.fullname}`, projectId, senderId, receiverId});
        done();
      })
      .catch((error) => {
        console.error(error);
      });

    this.updateInterviewQueue.on('error', (error) => {
      console.error('Error occurred in update interview queue: ', error);
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

      console.log('senderSocketId: ' + client.id);
      // Add task to message queue
      this.messageQueue
        .add({ projectId, content, senderId, receiverId, messageFlag, senderSocketId: client.id })
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

      const { title, startTime, endTime, disableFlag, projectId, senderId, receiverId, meeting_room_code, meeting_room_id, expired_at } = data;
      
      this.interviewQueue
        .add({ title, startTime, endTime, disableFlag, projectId, senderId, receiverId, senderSocketId: client.id, meeting_room_code, meeting_room_id, expired_at})
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error('Error occurred in message queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in message queue' });
    }
  }

  @SubscribeMessage('UPDATE_INTERVIEW')
  async updateInterview(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<void> {
    try {
      const checkValidate = await checkObjectMatchesDto(data, _InterviewUpdateDto);

      if (!checkValidate) {
        throw new Error('Invalid data');
      }

      const { interviewId, senderId, receiverId, projectId, title, startTime, endTime } = data;
      const clientId = client.id;

      this.updateInterviewQueue
        .add({ interviewId, senderId, receiverId, projectId, title, startTime, endTime, clientId })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error('Error occurred in update interview queue: ', error);
      this.server.to(client.id).emit('ERROR', { content: 'Error occurred in update interview queue' });
    }
  }
}
