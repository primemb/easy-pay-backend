import { Injectable } from '@nestjs/common';
import {
  ICreatePayment,
  ICreatePaymentReturn,
} from './interfaces/create-payment.interface';
import { ConfigService } from '@nestjs/config';
import { IVerifyPayment } from './interfaces/verify-payment.interface';

@Injectable()
export abstract class GatewayService {
  constructor(protected readonly configService: ConfigService) {}
  protected abstract _enabled: boolean;
  abstract get enable(): boolean;
  abstract set enable(value: boolean);
  abstract readonly name: string;
  protected abstract createPayment(
    args: ICreatePayment,
    backurl: string,
  ): Promise<ICreatePaymentReturn>;
  abstract verifyPayment(payload: any): Promise<IVerifyPayment>;

  sendPaymentToGateway(args: ICreatePayment) {
    const backurl =
      this.configService.get('SERVICE_ADDRESS') +
      `payments/verify/${this.name}`;

    return this.createPayment(args, backurl);
  }
}
