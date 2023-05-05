import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminDocument, AdminSchema } from './models/admin.schema';
import { DatabaseModule } from 'src/database/database.module';
import { AdminRepository } from './admin.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: AdminDocument.name, schema: AdminSchema },
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminRepository,
    { provide: HashingService, useClass: BcryptService },
  ],
})
export class AuthModule {}
