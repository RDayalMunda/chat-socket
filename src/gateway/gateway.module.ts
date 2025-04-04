import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { MessageModule } from '../message/message.module';
import { GroupModule } from 'src/group/group.module';
import { GatewayService } from './gateway.service';

@Module({
  imports: [MessageModule, GroupModule],
  providers: [MyGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
