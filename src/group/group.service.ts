import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.schema';
import mongoose, { Model } from 'mongoose';
import {
  CreateGroupDto,
  CreatePersonalGroupDto,
  SetLastMessageDto,
} from './group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private GroupModel: Model<Group>,
  ) { }

  async createGroup(groupObj: CreateGroupDto) {
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
      users: {
        $all: userIds,
        $size: userIds.length,
      },
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

  async getAllGroupsByUserId(userId: string) {
    const groups = await this.GroupModel.find(
      { users: { $in: [userId] } },
      { _id: 1 },
    );
    return groups;
  }

  async getAllGroupsDataByUserId(userId: string, userName: string) {
    const groups = await this.GroupModel.aggregate([
      // Match groups where user is a member
      {
        $match: {
          users: { $in: [userId] },
          $or: [
            {
              isPersonal: true,
              userNames: {
                $elemMatch: {
                  $regex: userName,
                  $options: 'i'
                }
              }
            },
            {
              isPersonal: false,
              name: {
                $regex: userName,
                $options: 'i'
              }
            },
          ],
        },
      },

      // Add a new field to determine the name based on conditions
      {
        $addFields: {
          transformedName: {
            $cond: {
              if: { $eq: ['$isPersonal', true] },
              then: {
                $cond: {
                  if: { $eq: [{ $size: '$users' }, 1] },
                  then: { $arrayElemAt: ['$userNames', 0] },
                  else: {
                    $cond: {
                      if: { $eq: [{ $arrayElemAt: ['$users', 0] }, userId] },
                      then: { $arrayElemAt: ['$userNames', 1] },
                      else: { $arrayElemAt: ['$userNames', 0] },
                    },
                  },
                },
              },
              else: '$name',
            },
          },
        },
      },

      // Project the final fields
      {
        $project: {
          _id: 1,
          name: '$transformedName',
          isPersonal: 1,
          users: 1,
          userNames: 1,
          lastMessageId: 1,
          updatedAt: 1,
          createdAt: 1,
        },
      },

      // Sort by updatedAt in descending order
      { $sort: { updatedAt: -1 } },

      // get last message data also ignore this if the last message is not found
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessageId',
          foreignField: '_id',
          as: 'lastMessage',
        },
      },
      // split array  of 1 element to object
      {
        $unwind: {
          path: '$lastMessage',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return groups;
  }
}
