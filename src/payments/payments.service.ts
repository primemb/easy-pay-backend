import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { GatewaysService } from './gateways/gateways.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Response } from 'express';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(forwardRef(() => GatewaysService))
    private readonly gateways: GatewaysService,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  getGatways() {
    return this.gateways.getAllGatewaysNames();
  }

  findAll() {
    return this.paymentRepository.find({});
  }

  async findOne(id: string) {
    const payment = this.paymentRepository.findOne({ _id: id });
    if (!payment) {
      throw new NotFoundException();
    }
    return payment;
  }

  async findByGatwayId(gatewayId: string) {
    const payment = this.paymentRepository.findOne({ gatewayId: gatewayId });
    if (!payment) {
      throw new NotFoundException();
    }
    return payment;
  }

  async create({
    amount,
    description,
    gateway,
    email,
    mobile,
    backurl,
    currency,
  }: CreatePaymentDto) {
    const gate = this.gateways.getGatewayByName(gateway);

    const { gatewayId, paymentUrl } = await gate.sendPaymentToGateway({
      amount,
      payload: {
        description,
        email,
        mobile,
      },
    });

    return this.paymentRepository.create({
      amount,
      description,
      gateway,
      currency: currency || 'IRT',
      gatewayId,
      paymentUrl,
      backurl,
    });
  }

  async verify(body: any, gatewayName: string, res: Response) {
    const gate = this.gateways.getGatewayByName(gatewayName);
    const result = await gate.verifyPayment(body);
    const payment = await this.paymentRepository.findOne({
      gatewayId: result.code,
    });
    return res.redirect(
      `${payment.backurl}?status=${result.result}&code=${result.code}&amount=${payment.amount}`,
    );
  }
}
