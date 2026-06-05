import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

/**
 * Bentuk payload yang di-encode ke dalam JWT access token.
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
}

/**
 * User object yang aman (tanpa password) yang ditempel ke request.user
 * setelah token tervalidasi.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * JwtStrategy memvalidasi access token via Passport.
 * Token diambil dari header Authorization: Bearer <token>.
 * Secret diambil dari env (JWT_SECRET) — tidak boleh hardcode.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  /**
   * Dipanggil Passport setelah signature & expiration token valid.
   * Return value menjadi request.user.
   */
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    // Token milik akun nonaktif dianggap tidak valid (cek setiap request).
    if (!user.isActive) {
      throw new UnauthorizedException('Akun dinonaktifkan');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
