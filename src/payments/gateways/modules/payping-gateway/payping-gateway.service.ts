import { Inject, Injectable } from '@nestjs/common';
import paypingConfig from './config/payping.config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GatewayService } from '../../abstarct.gateway.service';
import { ICreatePaymentReturn } from '../../interfaces/create-payment.interface';
import { ICreatePayment } from '../../interfaces/create-payment.interface';
import { IPaypingCreatepaymentResponse } from './interfaces/payping.interface';
import { catchError, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { AxiosHelper } from 'src/utils/axios-helper';

@Injectable()
export class PaypingGatewayService extends GatewayService {
  readonly name: string = 'Payping';
  private readonly paypingUrl: string = 'https://api.payping.ir/v2/';
  protected _enabled: boolean;

  constructor(
    @Inject(paypingConfig.KEY)
    private readonly paypingConfiguration: ConfigType<typeof paypingConfig>,
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
        .post<IPaypingCreatepaymentResponse>(
          `${this.paypingUrl}pay`,
          {
            amount,
            returnUrl: backurl,
            payerIdentity: payload.phoneNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${this.paypingConfiguration.PAYPING_TOKEN}`,
            },
          },
        )
        .pipe(
          catchError((err) => {
            AxiosHelper.mapAxiosError(err);
          }),
        ),
    );

    const paymentUrl = `https://api.payping.ir/v2/pay/gotoipg/${data.code}`;

    return {
      paymentUrl,
      gatewayId: data.code,
    };
  }

  async verifyPayment(invoiceId: string, amount: number): Promise<boolean> {
    return lastValueFrom(
      this.httpService
        .post(
          `${this.paypingUrl}pay/verify`,
          {
            amount,
            refId: invoiceId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.paypingConfiguration.PAYPING_TOKEN}`,
            },
          },
        )
        .pipe(map((res) => res.status === 200))
        .pipe(
          catchError((err) => {
            AxiosHelper.mapAxiosError(err);
          }),
        ),
    );
  }
}
