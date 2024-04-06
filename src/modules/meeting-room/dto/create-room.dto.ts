import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  meeting_room_code: string;

  @ApiProperty()
  meeting_room_id: string;

  @ApiProperty()
  expired_at?: Date;
}
