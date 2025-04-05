import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group, GroupSchema } from './group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayService } from 'src/gateway/gateway.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GatewayService],
  exports: [GroupService],
})
export class GroupModule {}
