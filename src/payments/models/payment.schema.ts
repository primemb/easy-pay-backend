import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { PaymentStatus } from '../enums/status.enum';

@Schema({ timestamps: true, versionKey: false })
export class PaymentDocument extends AbstractDocument {
  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  description: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status?: string;

  @Prop()
  gateway: string;

  @Prop({ unique: true })
  gatewayId: string;

  @Prop()
  paymentUrl: string;

  @Prop()
  backurl: string;

  @Prop()
  uniqueId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
