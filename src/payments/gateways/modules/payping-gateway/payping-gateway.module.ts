import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import paypingConfig from './config/payping.config';
import { HttpModule } from '@nestjs/axios';
import { PaypingGatewayService } from './payping-gateway.service';

@Module({
  imports: [ConfigModule.forFeature(paypingConfig), HttpModule],
  providers: [PaypingGatewayService],
  exports: [PaypingGatewayService],
})
export class PaypingGatewayModule {}
