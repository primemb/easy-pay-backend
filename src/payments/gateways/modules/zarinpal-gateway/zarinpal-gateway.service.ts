import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../../abstarct.gateway.service';
import zarinpalConfig from './config/zarinpal.config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  ICreatePayment,
  ICreatePaymentReturn,
} from '../../interfaces/create-payment.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { isAxiosError } from 'axios';
import { IZarinaplRequestResponse } from './interfaces/zarinpal.interface';

type ZarinpalConfig = ConfigType<typeof zarinpalConfig>;

@Injectable()
export class ZarinpalGateWayService extends GatewayService {
  readonly name: string = 'Zarinpal';
  private readonly zarinpalUrl: string =
    'https://api.zarinpal.com/pg/v4/payment/request.json';

  constructor(
    @Inject(zarinpalConfig.KEY)
    private readonly zarinpalConfig: ZarinpalConfig,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async createPayment({
    amount,
    backurl,
    payload,
  }: ICreatePayment): Promise<ICreatePaymentReturn> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<IZarinaplRequestResponse>(this.zarinpalUrl, {
          merchant_id: this.zarinpalConfig.ZARINPAL_MERCHENT_ID,
          amount,
          description: payload.description,
          currency: payload.currency,
          callback_url: backurl,
        })
        .pipe(
          catchError((err) => {
            if (isAxiosError(err)) {
              console.log(err.response.data);
              if (err.response.data.errors.message) {
                throw new BadRequestException(err.response.data.errors.message);
              }
            }
            throw err;
          }),
        ),
    );
    const paymentUrl = `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;

    return {
      paymentUrl,
      gatewayId: data.data.authority,
    };
  }
  verifyPayment(invoiceId: string, amount: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
