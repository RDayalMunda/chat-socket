import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { CreatePersonalGroupDto, SetLastMessageDto } from './group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private GroupModel: Model<Group>,
  ) {}

  async createGroup(groupObj: Group) {
    const newGroup = await this.GroupModel.create(groupObj);
    return newGroup;
  }

  async getGroupById(groupId: string) {
    const group = await this.GroupModel.findById(groupId);
    return group;
  }

  async checkPersonalGroup(userIds: string[]) {
    const group = await this.GroupModel.findOne({
      isPersonal: true,
      users: { $all: userIds },
    });
    return group;
  }

  async createPersonalGroup(groupObj: CreatePersonalGroupDto) {
    const newGroup = await this.GroupModel.create({
      ...groupObj,
      isPersonal: true,
    });
    return newGroup;
  }

  async setLastMessage(setLastMessageDto: SetLastMessageDto) {
    const groupId = new mongoose.Types.ObjectId(setLastMessageDto.groupId);
    const messageId = new mongoose.Types.ObjectId(setLastMessageDto.messageId);
    const group = await this.GroupModel.findByIdAndUpdate(groupId, {
      lastMessageId: messageId,
    });
    return group;
  }
}
