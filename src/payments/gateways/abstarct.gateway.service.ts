import { Injectable } from '@nestjs/common';
import {
  ICreatePayment,
  ICreatePaymentReturn,
} from './interfaces/create-payment.interface';

@Injectable()
export abstract class GatewayService {
  protected abstract _enabled: boolean;
  abstract get enable(): boolean;
  abstract set enable(value: boolean);
  abstract readonly name: string;
  abstract createPayment(args: ICreatePayment): Promise<ICreatePaymentReturn>;
  abstract verifyPayment(invoiceId: string, amount: number): Promise<boolean>;
}
