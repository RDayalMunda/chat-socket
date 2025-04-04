import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class GatewayService {
  constructor(private readonly groupService: GroupService) {}

  async joinUserRooms(socket: Socket, userId: string) {
    try {
      // Get all group IDs for the user
      const groups = await this.groupService.getAllGroupsByUserId(userId);

      // Join each group room
      groups.forEach((group) => {
        socket.join(group._id.toString());
      });
    } catch (error) {
      console.error('Error joining rooms:', error);
    }
  }
}
