import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../../abstarct.gateway.service';
import zarinpalConfig from './config/zarinpal.config';
import { ConfigService, ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  ICreatePayment,
  ICreatePaymentReturn,
} from '../../interfaces/create-payment.interface';
import { catchError, lastValueFrom } from 'rxjs';
import { isAxiosError } from 'axios';
import { IZarinaplCreatepaymentResponse } from './interfaces/zarinpal.interface';
import { IVerifyPayment } from '../../interfaces/verify-payment.interface';
import { PaymentDocument } from 'src/payments/models/payment.schema';

@Injectable()
export class ZarinpalGateWayService extends GatewayService {
  protected _enabled: boolean;
  readonly name: string = 'zarinpal';
  private readonly zarinpalUrl: string =
    'https://api.zarinpal.com/pg/v4/payment/request.json';

  constructor(
    @Inject(zarinpalConfig.KEY)
    private readonly zarinpalConfiguration: ConfigType<typeof zarinpalConfig>,
    private readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(configService);
    this._enabled = true;
  }

  get enable() {
    return this._enabled;
  }

  set enable(value: boolean) {
    this._enabled = value;
  }

  async createPayment(
    { amount, payload }: ICreatePayment,
    backurl: string,
  ): Promise<ICreatePaymentReturn> {
    const { data } = await lastValueFrom(
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

  verifyPayment(
    payment: PaymentDocument,
    payload: any,
  ): Promise<IVerifyPayment> {
    throw new Error('Method not implemented.');
  }
}
