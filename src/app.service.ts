import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Advanced Mobile Programming Course, Hello Group 01 from Luc Tran Quang ^^!';
  }
}
