import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Group {
  @Prop({ default: '' })
  name: string;

  @Prop({ default: [] })
  userNames: string[]; // names of the users in the group, in the same order in which the Ids are present in the users array

  @Prop({ default: false })
  isPersonal: boolean;

  @Prop({ default: null, ref: 'Message' })
  lastMessageId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: [] })
  users: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
