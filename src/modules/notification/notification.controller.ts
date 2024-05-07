import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { NotificationService } from 'src/modules/notification/notification.service';

@ApiTags('notification')
@Controller('api/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('getByReceiverId/:receiverId')
  @Auth()
  async findByStudentId(@Param('receiverId') receiverId: string | number): Promise<any[]> {
    return await this.notificationService.findByReceiverId(receiverId);
  }

  @Auth()
  @Patch('readNoti/:id')
  async disableInterviewById(@Param('id') id: number | string) {
    return await this.notificationService.readNotification(id);
  }
}
