import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnModuleInit {
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
  onNewMessage(@MessageBody() body: any) {
    console.log('body', body);
    // check who sent message
    // check the target room`
    this.server.emit('onMessage', { ...body, from: 'server' });
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
