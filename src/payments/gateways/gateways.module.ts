import { Module } from '@nestjs/common';
import * as Gateways from './modules/index';
import { ZarinpalGateWayService } from './modules/zarinpal-gateway/zarinpal-gateway.service';
import { GatewayService } from './abstarct.gateway.service';
import { GatewaysService } from './gateways.service';
import { GATEWAYS_LIST } from './gateways.constants';
import { GatewaysController } from './gateways.controller';
import { PaypingGatewayService } from './modules/payping-gateway/payping-gateway.service';

@Module({
  imports: [Gateways.ZarinpalGatewayModule, Gateways.PaypingGatewayModule],
  controllers: [GatewaysController],
  providers: [
    {
      provide: GATEWAYS_LIST,
      useFactory: (
        zarinpalGatewayService: ZarinpalGateWayService,
        paypingGatewayService: PaypingGatewayService,
      ): GatewayService[] => {
        return [zarinpalGatewayService, paypingGatewayService];
      },
      inject: [ZarinpalGateWayService, PaypingGatewayService],
    },
    GatewaysService,
  ],
  exports: [GatewaysService],
})
export class GatewaysModule {}
