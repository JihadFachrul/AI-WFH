import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../../modules/auth/strategies/jwt.strategy';

/**
 * RolesGuard mengecek apakah role user (dari JWT) termasuk salah satu role
 * yang diizinkan oleh @Roles(...). Harus dipasang SETELAH JwtAuthGuard
 * agar request.user sudah terisi.
 *
 * Jika handler tidak punya metadata @Roles, guard membiarkan request lewat
 * (route hanya butuh terautentikasi).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: AuthUser }>();

    if (!user) {
      throw new ForbiddenException('Akses ditolak');
    }

    const allowed = requiredRoles.some((role) => role === user.role);
    if (!allowed) {
      throw new ForbiddenException(
        'Anda tidak memiliki izin untuk mengakses resource ini',
      );
    }

    return true;
  }
}
