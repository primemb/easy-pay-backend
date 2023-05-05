import { Module } from '@nestjs/common';
import { ZarinpalGateWayService } from './zarinpal-gateway.service';

@Module({
  providers: [ZarinpalGateWayService],
  exports: [ZarinpalGateWayService],
})
export class ZarinpalGatewayModule {}
