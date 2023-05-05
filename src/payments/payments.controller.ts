import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('get-gateways')
  getGateways() {
    return this.paymentsService.getGatways();
  }

  @Post('create')
  create(@Body() body: CreatePaymentDto) {
    return this.paymentsService.create(body);
  }
}
