import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { isAxiosError } from 'axios';

export class AxiosHelper {
  static mapAxiosError(error: any): never {
    if (isAxiosError(error)) {
      switch (error.response.status) {
        case 400:
          throw new BadRequestException(error.response.data);
        case 401:
          throw new UnauthorizedException('Please check your payping token');
        case 403:
          throw new UnauthorizedException('Please check your payping token');
        default:
          throw new BadRequestException(error.response.data);
      }
    }
    throw error;
  }
}
