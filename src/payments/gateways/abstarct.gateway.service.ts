import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class GatewayService {
  abstract readonly name: string;
  abstract createPayment(amount: number, backurl: string): Promise<string>;
  abstract verifyPayment(invoiceId: string, amount: number): Promise<boolean>;
}
