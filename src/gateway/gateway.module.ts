import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [MessageModule],
  providers: [MyGateway],
})
export class GatewayModule {}
