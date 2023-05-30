import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import paypingConfig from './config/payping.config';
import { HttpModule } from '@nestjs/axios';
import { PaypingGatewayService } from './payping-gateway.service';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forFeature(paypingConfig),
    HttpModule,
    forwardRef(() => PaymentsModule),
  ],
  providers: [PaypingGatewayService],
  exports: [PaypingGatewayService],
})
export class PaypingGatewayModule {}
