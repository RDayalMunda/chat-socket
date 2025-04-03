import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get(':roomId')
  async getMessagesByRoomId(@Param('roomId') roomId: string) {
    try {
      const messages = await this.messageService.getMessagesByRoomId(roomId);
      return {
        status: 'success',
        messages,
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }
}
