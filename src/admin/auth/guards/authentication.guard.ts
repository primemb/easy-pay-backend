import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enums';
import { Reflector } from '@nestjs/core';
import { AdminGuard } from './admin-guard.guard';
import { AUTH_TYPE_KEY } from '../decorators/admin-decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.None;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Admin]: this.adminGuard,
    [AuthType.User]: { canActivate: () => true },
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly adminGuard: AdminGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
