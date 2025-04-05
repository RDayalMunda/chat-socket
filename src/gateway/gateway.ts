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
import { GatewayService } from './gateway.service';
import { SocketTypingDto } from './gateway.dto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnModuleInit {
  constructor(
    private readonly messageService: MessageService,
    private readonly groupService: GroupService,
    private readonly gatewayService: GatewayService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connected to:', socket.id);

      if (socket.handshake.query.userConfig) {
        try {
          const userConfig = JSON.parse(
            (socket.handshake.query.userConfig as string) || '{}',
          );
          if (userConfig.id) {
            this.gatewayService.joinUserRooms(socket, userConfig.id);
          }
        } catch (error) {
          console.error('Error parsing userConfig:', error);
        }
      }

      socket.on('disconnect', () => {
        console.log('disconnected from:', socket.id);
      });
    });
  }

  @SubscribeMessage('message')
  async onNewMessage(@MessageBody() body: CreateMessageDto) {
    const message = await this.messageService.createMessage(body);

    // find out the groupId and emit on that particular groupId
    this.server
      .to(body.groupId)
      .emit('onMessage', { from: 'socket', message: message });

    // update the lastMessageId in the group
    await this.groupService.setLastMessage({
      groupId: body.groupId,
      messageId: message._id.toString(),
    });
  }

  @SubscribeMessage('typing')
  onTyping(@MessageBody() body: SocketTypingDto) {
    console.log('typing', body);
    // check who is typing
    // check the target rooms
    // find out the users present in the target rooms
    // emit to all the users present in the target rooms

    this.server.to(body.groupId).emit('onTyping', { from: 'socket', typing: body });
  }
}
