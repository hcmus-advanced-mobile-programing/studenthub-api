import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/decorators/http.decorators';
import { NotificationService } from 'src/modules/notification/notification.service';

@Controller('api/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('getByReceiverId/:receiverId')
  @Auth()
  async findByStudentId(@Param('receiverId') receiverId: string | number): Promise<any[]> {
    return await this.notificationService.findByReceiverId(receiverId);
  }
}
