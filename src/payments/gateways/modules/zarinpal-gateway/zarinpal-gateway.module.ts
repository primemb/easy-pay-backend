import { Module } from '@nestjs/common';
import { ZarinpalGateWayService } from './zarinpal-gateway.service';
import { ConfigModule } from '@nestjs/config';
import zarinpalConfig from './config/zarinpal.config';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [ConfigModule.forFeature(zarinpalConfig), HttpModule],
  providers: [ZarinpalGateWayService],
  exports: [ZarinpalGateWayService],
})
export class ZarinpalGatewayModule {}
