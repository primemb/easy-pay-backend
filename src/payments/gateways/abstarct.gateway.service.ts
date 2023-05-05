import { Injectable } from '@nestjs/common';
import {
  ICreatePayment,
  ICreatePaymentReturn,
} from './interfaces/create-payment.interface';

@Injectable()
export abstract class GatewayService {
  abstract readonly name: string;
  abstract createPayment(args: ICreatePayment): Promise<ICreatePaymentReturn>;
  abstract verifyPayment(invoiceId: string, amount: number): Promise<boolean>;
}
