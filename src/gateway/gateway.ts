import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from '../message/message.service';
import { CreateMessageDto } from 'src/message/message.dto';
import { GroupService } from 'src/group/group.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnModuleInit {
  constructor(
    private readonly messageService: MessageService,
    private readonly groupService: GroupService,
  ) {}

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
  async onNewMessage(@MessageBody() body: CreateMessageDto) {
    const message = await this.messageService.createMessage(body);
    
    // find out the groupId and emit on that particular groupId
    this.server.to(body.groupId).emit('onMessage', { ...message, from: 'server' });
    
    // update the lastMessageId in the group
    await this.groupService.setLastMessage( { groupId: body.groupId, messageId: message._id.toString() } )
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
