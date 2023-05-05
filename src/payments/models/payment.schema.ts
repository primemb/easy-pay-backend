import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { PaymentStatus } from '../enums/status.enum';

@Schema()
export class PaymentDocument extends AbstractDocument {
  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  description: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: string;

  @Prop()
  gateway: string;

  @Prop()
  gatewayId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
