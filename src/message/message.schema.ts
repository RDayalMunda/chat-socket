import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FileDto } from 'src/files/files.dto';
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

  @Prop({ type: [FileDto] })
  files: FileDto[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
