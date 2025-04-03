import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
  timestamps: true
})
export class Group {
  @Prop({default : ''})
  name: string

  @Prop({ default: false})
  isPersonal: boolean

  @Prop({ default: null, ref: 'Message'})
  lastMessageId: mongoose.Schema.Types.ObjectId

}

export const GroupSchema = SchemaFactory.createForClass(Group)