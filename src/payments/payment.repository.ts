import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database/abstract.repository';
import { PaymentDocument } from './models/payment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentRepository extends AbstractRepository<PaymentDocument> {
  protected readonly logger = new Logger(PaymentDocument.name);

  constructor(
    @InjectModel(PaymentDocument.name) paymentModel: Model<PaymentDocument>,
  ) {
    super(paymentModel);
  }
}
