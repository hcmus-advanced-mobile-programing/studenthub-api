import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from 'src/modules/message/message.controller';
import { Message } from 'src/modules/message/message.entity';
import { MessageService } from 'src/modules/message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
