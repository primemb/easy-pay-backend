import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginAdminDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: CreateAdminDto) {
    return this.authService.register(body);
  }
}
