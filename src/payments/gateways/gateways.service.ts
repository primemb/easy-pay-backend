import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GatewayService } from './abstarct.gateway.service';
import { GATEWAYS_LIST } from './gateways.constants';
import { ToggleGatewayDto } from './dto/toggle-gateway.dto';

@Injectable()
export class GatewaysService {
  constructor(
    @Inject(GATEWAYS_LIST) private readonly gatewayService: GatewayService[],
  ) {}
  getAllGatewaysNames() {
    return this.gatewayService.filter((g) => g.enable).map((g) => g.name);
  }

  getGatewayByName(name: string) {
    const service = this.gatewayService.find(
      (g) => g.name.toLowerCase() === name.toLowerCase() && g.enable,
    );

    if (!service) {
      throw new BadGatewayException("Gateway doesn't exist");
    }

    return service;
  }

  toggleGateway({ name, value }: ToggleGatewayDto) {
    const service = this.gatewayService.find((g) => g.name === name);

    if (!service) {
      throw new NotFoundException("Gateway doesn't exist");
    }

    service.enable = value;

    return { result: true };
  }
}
