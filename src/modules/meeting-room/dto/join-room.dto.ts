import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {
  @ApiProperty()
  meeting_room_code: string;

  @ApiProperty()
  meeting_room_id: string;
}
