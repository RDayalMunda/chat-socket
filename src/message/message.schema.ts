import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ default: '' })
  content: string;

  @Prop()
  senderId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: '' })
  senderName: string;

  @Prop()
  groupId: mongoose.Schema.Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
