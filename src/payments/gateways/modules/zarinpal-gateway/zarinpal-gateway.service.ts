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
import { IZarinaplCreatepaymentResponse } from './interfaces/zarinpal.interface';

@Injectable()
export class ZarinpalGateWayService extends GatewayService {
  protected _enabled: boolean;
  readonly name: string = 'Zarinpal';
  private readonly zarinpalUrl: string =
    'https://api.zarinpal.com/pg/v4/payment/request.json';

  constructor(
    @Inject(zarinpalConfig.KEY)
    private readonly zarinpalConfiguration: ConfigType<typeof zarinpalConfig>,
    private readonly httpService: HttpService,
  ) {
    super();
    this._enabled = true;
  }

  get enable() {
    return this._enabled;
  }

  set enable(value: boolean) {
    this._enabled = value;
  }

  async createPayment({
    amount,
    backurl,
    payload,
  }: ICreatePayment): Promise<ICreatePaymentReturn> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<IZarinaplCreatepaymentResponse>(this.zarinpalUrl, {
          merchant_id: this.zarinpalConfiguration.ZARINPAL_MERCHENT_ID,
          amount,
          description: payload.description,
          currency: payload.currency,
          callback_url: backurl,
        })
        .pipe(
          catchError((err) => {
            if (isAxiosError(err)) {
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
