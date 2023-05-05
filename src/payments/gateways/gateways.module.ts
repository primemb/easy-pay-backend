import { Module } from '@nestjs/common';
import * as Gateways from './modules/index';
import { ZarinpalGateWayService } from './modules/zarinpal-gateway/zarinpal-gateway.service';
import { GatewayService } from './abstarct.gateway.service';
import { GatewaysService } from './gateways.service';
import { GATEWAYS_LIST } from './gateways.constants';

@Module({
  imports: [Gateways.ZarinpalGatewayModule],
  providers: [
    {
      provide: GATEWAYS_LIST,
      useFactory: (
        zarinpalGatewayService: ZarinpalGateWayService,
      ): GatewayService[] => {
        return [zarinpalGatewayService];
      },
      inject: [ZarinpalGateWayService],
    },
    GatewaysService,
  ],
  exports: [GatewaysService],
})
export class GatewaysModule {}
