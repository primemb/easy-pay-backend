import {
  Inject,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AdminDocument } from './models/admin.schema';
import { HashingService } from './hashing/hashing.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminRepository.findOne({
      username: loginAdminDto.username,
    });

    if (!admin) {
      throw new UnauthorizedException();
    }

    const isPasswordMatch = await this.hashingService.compare(
      loginAdminDto.password,
      admin.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    return this.generateToken(admin);
  }

  async register(createAdminDto: CreateAdminDto) {
    const isExist = await this.adminRepository.findOne({
      $or: [
        { email: createAdminDto.email },
        { username: createAdminDto.username },
      ],
    });

    if (isExist) {
      throw new HttpException('Email or username already exist', 400);
    }

    const hashedPassword = await this.hashingService.hash(
      createAdminDto.password,
    );

    const admin = await this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return this.generateToken(admin);
  }

  private async generateToken(admin: AdminDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        admin._id.toString(),
        this.jwtConfiguration.accessTokenTtl,
      ),

      this.signToken(
        admin._id.toString(),
        this.jwtConfiguration.refreshTokenTtl,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtConfiguration.accessTokenTtl,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
