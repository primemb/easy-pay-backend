import { Injectable } from '@nestjs/common';
import { GatewaysService } from './gateways/gateways.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly gateways: GatewaysService) {}

  getGatways() {
    return this.gateways.getAllGatewaysNames();
  }
}
