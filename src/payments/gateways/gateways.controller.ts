import { Body, Controller, Post } from '@nestjs/common';
import { ToggleGatewayDto } from './dto/toggle-gateway.dto';
import { GatewaysService } from './gateways.service';
import { Auth } from 'src/admin/auth/decorators/admin-decorator';
import { AuthType } from 'src/admin/auth/enums/auth-type.enums';

@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}
  @Post('toggle')
  @Auth(AuthType.Admin)
  disable(@Body() body: ToggleGatewayDto) {
    return this.gatewaysService.toggleGateway(body);
  }
}
