// meeting-room/meeting-room.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './meeting-room.entity';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  providers: [MeetingRoomService],
  controllers: [MeetingRoomController],
})
export class MeetingRoomModule {}
