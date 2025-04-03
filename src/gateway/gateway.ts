import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from '../message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnModuleInit {
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connected to:', socket.id);
      socket.on('disconnect', () => {
        console.log('disconnected from:', socket.id);
      });
    });
  }

  @SubscribeMessage('message')
  async onNewMessage(@MessageBody() body: any) {
    console.log('body', body);
    const message = await this.messageService.createMessage(body);
    console.log('message', message);
    // find out the roomId and emit on that particular roomId
    // this.server.emit('onMessage', { ...message, from: 'server' });
  }

  @SubscribeMessage('typing')
  onTyping(@MessageBody() body: any) {
    console.log('typing', body);
    // check who is typing
    // check the target rooms
    // find out the users present in the target rooms
    // emit to all the users present in the target rooms
    this.server.emit('onTyping', { ...body, from: 'server' });
  }
}
