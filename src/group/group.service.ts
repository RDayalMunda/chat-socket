import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.schema';
import { Model } from 'mongoose';
import { CreatePersonalGroupDto } from './group.dto';

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
}
