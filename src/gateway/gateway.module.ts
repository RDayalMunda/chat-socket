import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { MessageModule } from '../message/message.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [MessageModule, GroupModule],
  providers: [MyGateway],
})
export class GatewayModule {}
