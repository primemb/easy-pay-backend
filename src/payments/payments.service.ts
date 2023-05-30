import { Injectable, NotFoundException } from '@nestjs/common';
import { GatewaysService } from './gateways/gateways.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
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

  async verify({ amount, gateway, refId }: VerifyPaymentDto) {
    const gate = this.gateways.getGatewayByName(gateway);
    return gate.verifyPayment(refId, amount);
  }
}
