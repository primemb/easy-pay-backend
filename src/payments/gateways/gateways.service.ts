import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from './abstarct.gateway.service';
import { GATEWAYS_LIST } from './gateways.constants';

@Injectable()
export class GatewaysService {
  constructor(
    @Inject(GATEWAYS_LIST) private readonly gatewayService: GatewayService[],
  ) {}
  getAllGatewaysNames() {
    return this.gatewayService.map((g) => g.name);
  }

  getGatewayByName(name: string) {
    const service = this.gatewayService.find((g) => g.name === name);

    if (!service) {
      throw new BadGatewayException();
    }

    return service;
  }
}
