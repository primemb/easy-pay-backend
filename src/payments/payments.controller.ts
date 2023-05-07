import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Auth } from 'src/admin/auth/decorators/admin-decorator';
import { AuthType } from 'src/admin/auth/enums/auth-type.enums';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('get-gateways')
  getGateways() {
    return this.paymentsService.getGatways();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreatePaymentDto) {
    return this.paymentsService.create(body);
  }

  @Get()
  @Auth(AuthType.Admin)
  getPayments() {
    return this.paymentsService.findAll();
  }

  @Get('/:id')
  @Auth(AuthType.Admin)
  getPaymentById(@Param() id: string) {
    return this.paymentsService.findOne(id);
  }
}
