import { Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../../abstarct.gateway.service';
import zarinpalConfig from './config/zarinpal.config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

type ZarinpalConfig = ConfigType<typeof zarinpalConfig>;

@Injectable()
export class ZarinpalGateWayService extends GatewayService {
  readonly name: string = 'Zarinpal';

  constructor(
    @Inject(zarinpalConfig.KEY)
    private readonly zarinpalConfig: ZarinpalConfig,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  createPayment(
    amount: number,
    backurl: string,
  ): Promise<{ paymentUrl: string; gatewayId: string }> {
    throw new Error('Method not implemented.');
  }
  verifyPayment(invoiceId: string, amount: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
