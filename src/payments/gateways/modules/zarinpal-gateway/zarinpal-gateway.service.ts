import { Injectable } from '@nestjs/common';
import { GatewayService } from '../../abstarct.gateway.service';

@Injectable()
export class ZarinpalGateWayService extends GatewayService {
  readonly name: string = 'Zarinpal';

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
