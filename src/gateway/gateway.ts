import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import{ Server } from "socket.io"
@WebSocketGateway({})
export class MyGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket)=>{
      console.log('connected to:', socket.id)
    })
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any){
    console.log('body', body)
    this.server.emit('onMessage', {...body, from: 'server'})
  }
}