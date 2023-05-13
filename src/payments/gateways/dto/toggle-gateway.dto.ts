import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class ToggleGatewayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  value: boolean;
}
