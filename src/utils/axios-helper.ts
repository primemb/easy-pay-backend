import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';
import { Logger } from '@nestjs/common';

export class AxiosHelper {
  private static readonly logger = new Logger(AxiosHelper.name);

  static mapAxiosError(error: any): never {
    if (isAxiosError(error) && error.response) {
      switch (error.response.status) {
        case 400:
          throw new BadRequestException(error.response.data);
        case 401:
          throw new UnauthorizedException('Please check your payping token');
        case 403:
          throw new UnauthorizedException('Please check your payping token');
        default:
          console.log(error.response.data);
          throw new InternalServerErrorException(
            "We're sorry, but something went wrong",
          );
      }
    }
    AxiosHelper.logger.error(error);
    throw new InternalServerErrorException(
      "We're sorry, but something went wrong",
    );
  }
}
