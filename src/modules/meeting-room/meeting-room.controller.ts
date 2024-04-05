import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger'; // Import Swagger decorators
import { MeetingRoomService } from './meeting-room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { MeetingRoom } from './meeting-room.entity'; // Import MeetingRoom entity

@Controller('meeting-room')
@ApiTags('Meeting Room') // Add tags for Swagger documentation
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create-room') // Change the route path to create-room
  @ApiOperation({ summary: 'Create a meeting room' }) // Add Swagger documentation
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<MeetingRoom> { // Update return type
    return this.meetingRoomService.create(createRoomDto);
  }

  @Get('check-availability') // Change the route path to check-availability and use query parameters
  @ApiOperation({ summary: 'Check availability of a meeting room' }) // Add Swagger documentation
  @ApiOkResponse({ description: 'Meeting room availability check succeeded', type: Boolean }) // Update response type to Boolean
  @ApiBadRequestResponse({ description: 'Invalid meeting room code or ID' })
  async checkAvailability(@Query() params: JoinRoomDto): Promise<boolean> { // Use Query decorator instead of Param
    const { meeting_room_code, meeting_room_id } = params;
    const meetingRoom = await this.meetingRoomService.checkAvailability(meeting_room_code, meeting_room_id);
    return !!meetingRoom; // Convert meetingRoom to boolean (true if exists, false if undefined)
  }
}
