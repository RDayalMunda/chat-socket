import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  // user this API, when clicking on the user for the first Time.
  // This will give you the data of the group if it exists.
  // Else it will create a new group and return the data of the new group.
  @Post('check-personal-group')
  async checkPersonalGroup(
    @Body()
    body: {
      users: any;
    },
  ) {
    const { users } = body;
    const responseObj: { status: string; groupData?: any } = {
      status: 'success',
    };

    const userIds = [users[0].id];
    const userNames = [users[0].name];
    if (users[1].id != users[0].id) {
      userIds.push(users[1].id);
      userNames.push(users[1].name);
    }

    const existingGroup = await this.groupService.checkPersonalGroup(userIds);
    if (existingGroup) {
      responseObj.groupData = existingGroup;
    } else {
      const newGroup = await this.groupService.createPersonalGroup({
        users: userIds,
        userNames: userNames,
      });
      responseObj.groupData = newGroup;
    }
    return responseObj;
  }

  @Get('all')
  async getAllGroupsData(@Query('userId') userId: string) {
    const groups = await this.groupService.getAllGroupsDataByUserId(userId);
    return {
      status: 'success',
      groups: groups,
    };
  }
}
