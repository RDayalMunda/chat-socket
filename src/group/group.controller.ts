import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './group.dto';
import { GatewayService } from 'src/gateway/gateway.service';

@Controller('group')
export class GroupController {
  constructor(
    private groupService: GroupService,
    private gatewayService: GatewayService,
  ) { }

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
    const responseObj: {
      status: string;
      groupData?: any;
      isCreated?: boolean;
    } = {
      status: 'success',
      isCreated: false,
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
      const userIndex =
        existingGroup.users.length == 1
          ? 0
          : existingGroup.users[0] == userIds[0]
            ? 1
            : 0;
      responseObj.groupData.name = existingGroup.userNames[userIndex];
    } else {
      const newGroup = await this.groupService.createPersonalGroup({
        users: userIds,
        userNames: userNames,
      });
      responseObj.groupData = newGroup;
      responseObj.isCreated = true;

      // Make all connected sockets with these userIds join the new group room
      const server = GatewayService.getServer();
      if (server) {
        userIds.forEach((userId) => {
          const sockets = server.sockets.sockets;

          // to calculate the group name for personal group
          const userIndex =
            newGroup.users.length == 1
              ? 0
              : newGroup.users[0] == userId
                ? 1
                : 0;
          const groupName = newGroup.userNames[userIndex];

          sockets.forEach((socket) => {
            if (socket.handshake.query.userConfig) {
              try {
                const userConfig = JSON.parse(
                  (socket.handshake.query.userConfig as string) || '{}',
                );
                if (userConfig.id === userId) {
                  const roomId = newGroup._id.toString();
                  socket.join(roomId);
                  console.log(
                    userConfig.name,
                    'joined room',
                    newGroup._id.toString(),
                  );
                  newGroup.name = groupName;
                  server.to(socket.id).emit('onRoomCreated', {
                    from: 'socket',
                    group: newGroup,
                  });
                  console.log(
                    'on room created: and fired on',
                    roomId,
                    groupName,
                  );
                }
              } catch (error) {
                console.error('Error parsing userConfig:', error);
              }
            }
          });
        });
      }
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

  @Post('create')
  async createGroup(@Body() body: CreateGroupDto) {
    const newGroup = await this.groupService.createGroup(body);

    // Make all connected sockets with these userIds join the new group room
    const server = GatewayService.getServer();
    if (server) {
      newGroup.users.forEach((userId) => {
        const sockets = server.sockets.sockets;

        const groupName = newGroup.name
        sockets.forEach((socket) => {
          if (socket.handshake.query.userConfig) {
            try {
              const userConfig = JSON.parse(
                (socket.handshake.query.userConfig as string) || '{}',
              );
              if (userConfig.id === userId) {
                const roomId = newGroup._id.toString();
                socket.join(roomId);
                console.log(
                  userConfig.name,
                  'joined room',
                  newGroup._id.toString(),
                );
                server.to(socket.id).emit('onRoomCreated', {
                  from: 'socket',
                  group: newGroup,
                });
                console.log(
                  'on room created: and fired on',
                  roomId,
                  groupName,
                );
              }
            } catch (error) {
              console.error('Error parsing userConfig:', error);
            }
          }
        });
      });
    }
    return {
      status: 'success',
      group: newGroup,
    };
  }
}
