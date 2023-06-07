import { Injectable, NotFoundException } from '@nestjs/common';
import { GatewaysService } from './gateways/gateways.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

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

  async findByUniqueId(uniqueId: string) {
    const payment = await this.paymentRepository.findOne({
      uniqueId: uniqueId,
    });
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
    const uniqueId = uuidv4();
    const gate = this.gateways.getGatewayByName(gateway);

    const { gatewayId, paymentUrl } = await gate.sendPaymentToGateway({
      paymentId: uniqueId,
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
      uniqueId,
    });
  }

  async verify(
    body: any,
    gatewayName: string,
    uniqueId: string,
    res: Response,
  ) {
    try {
      console.log(uniqueId);
      const paymentDocument = await this.findByUniqueId(uniqueId);
      const gate = this.gateways.getGatewayByName(gatewayName);
      const result = await gate.verifyPayment(paymentDocument, body);
      return res.redirect(
        `${paymentDocument.backurl}?status=${result.result}&uniqueId=${paymentDocument.uniqueId}&amount=${paymentDocument.amount}`,
      );
    } catch (error) {
      console.log(error);
      return res.json({ status: 'error', message: 'خطایی رخ داده است' });
    }
  }
}
