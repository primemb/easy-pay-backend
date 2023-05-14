import { Module } from '@nestjs/common';
import * as Gateways from './modules/index';
import { ZarinpalGateWayService } from './modules/zarinpal-gateway/zarinpal-gateway.service';
import { GatewayService } from './abstarct.gateway.service';
import { GatewaysService } from './gateways.service';
import { GATEWAYS_LIST } from './gateways.constants';
import { GatewaysController } from './gateways.controller';
import { PaypingModule } from './modules/payping/payping.module';

@Module({
  imports: [Gateways.ZarinpalGatewayModule, PaypingModule],
  controllers: [GatewaysController],
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
