import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import paypingConfig from './config/payping.config';
import { ConfigService, ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GatewayService } from '../../abstarct.gateway.service';
import { ICreatePaymentReturn } from '../../interfaces/create-payment.interface';
import { ICreatePayment } from '../../interfaces/create-payment.interface';
import {
  IPaypingCreatepaymentResponse,
  IPaypingVerifyPaymentBody,
} from './interfaces/payping.interface';
import { catchError, firstValueFrom, lastValueFrom, map, of } from 'rxjs';
import { AxiosHelper } from 'src/utils/axios-helper';
import { IVerifyPayment } from '../../interfaces/verify-payment.interface';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class PaypingGatewayService extends GatewayService {
  readonly name: string = 'payping';
  private readonly paypingUrl: string = 'https://api.payping.ir/v2/';
  protected _enabled: boolean;

  constructor(
    @Inject(paypingConfig.KEY)
    private readonly paypingConfiguration: ConfigType<typeof paypingConfig>,
    private readonly httpService: HttpService,
    private readonly paymentsService: PaymentsService,
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

  async verifyPayment({
    code,
    refid,
  }: IPaypingVerifyPaymentBody): Promise<IVerifyPayment> {
    if (!code || !refid) {
      throw new BadRequestException();
    }

    const payment = await this.paymentsService.findByGatwayId(code);

    if (!payment) {
      throw new BadRequestException();
    }

    const result = await lastValueFrom(
      this.httpService
        .post(
          `${this.paypingUrl}pay/verify`,
          {
            amount: payment.amount,
            refid,
          },
          {
            headers: {
              Authorization: `Bearer ${this.paypingConfiguration.PAYPING_TOKEN}`,
            },
          },
        )
        .pipe(map((res) => res.status === 200))
        .pipe(
          catchError(() => {
            return of(false);
          }),
        ),
    );

    return {
      result,
      code,
      amount: payment.amount,
    };
  }
}
