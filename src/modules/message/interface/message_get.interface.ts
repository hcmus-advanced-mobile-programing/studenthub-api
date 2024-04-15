import { Message } from "src/modules/message/message.entity";

export interface MessageGet{
  messages: Message[],
  page: number,
  totalPage: number,
  pageSize: number,
}