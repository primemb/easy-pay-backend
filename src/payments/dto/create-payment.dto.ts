import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsMobilePhone,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsMobilePhone('fa-IR')
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  gateway: string;

  @IsString()
  backurl: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
