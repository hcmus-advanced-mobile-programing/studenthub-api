import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRoom } from './meeting-room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom)
    private readonly meetingRoomRepository: Repository<MeetingRoom>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<MeetingRoom> {
    const meetingRoom = this.meetingRoomRepository.create(createRoomDto);
    return this.meetingRoomRepository.save(meetingRoom);
  }

  async checkAvailability(meeting_room_code: string, meeting_room_id: string): Promise<boolean> {
    const meetingRoom = await this.meetingRoomRepository
      .createQueryBuilder('MeetingRoom')
      .where('MeetingRoom.meeting_room_code = :meetingRoomCode', { meetingRoomCode: meeting_room_code })
      .andWhere('MeetingRoom.meeting_room_id = :meetingRoomID', { meetingRoomID: meeting_room_id })
      .getOne();

    if (!meetingRoom) {
      return false; // Meeting room not found
    }

    // Check if the meeting room is expired
    const currentDate = new Date();
    if (meetingRoom.expired_at && meetingRoom.expired_at < currentDate) {
      return false; // Meeting room has expired
    }

    return true; // Meeting room is available
  }
}
