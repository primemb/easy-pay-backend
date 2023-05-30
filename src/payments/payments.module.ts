import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { GatewaysModule } from './gateways/gateways.module';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentDocument, PaymentSchema } from './models/payment.schema';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [
    forwardRef(() => GatewaysModule),
    DatabaseModule.forFeature([
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
