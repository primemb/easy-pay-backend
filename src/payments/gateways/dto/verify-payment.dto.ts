import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  refId: string;

  @IsNumber()
  @IsPositive()
  code: string;
}
