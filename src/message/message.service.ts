import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import mongoose, { Model } from 'mongoose';
import { CreateMessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private MessageModel: Model<Message>,
  ) {}

  async getMessagesByRoomId(roomId: string) {
    const messages = await this.MessageModel.find({
      roomId: new mongoose.Types.ObjectId(roomId),
    });
    return messages;
  }

  async createMessage(messageObj: CreateMessageDto) {
    const { content, senderId, senderName, groupId } = messageObj;
    const newMessage = await this.MessageModel.create({
      content,
      senderId,
      senderName,
      groupId: new mongoose.Types.ObjectId(groupId),
    });
    return newMessage;
  }
}
