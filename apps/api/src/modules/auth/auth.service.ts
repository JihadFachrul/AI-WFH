import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Bentuk user yang aman untuk dikembalikan ke client (tanpa password).
 */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResult {
  accessToken: string;
  user: SafeUser;
}

/**
 * AuthService memuat seluruh business logic autentikasi:
 * register, login, hashing/compare password, dan generate JWT.
 * Controller hanya memanggil method di sini.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register user baru: cegah duplikasi email, hash password, simpan,
   * lalu kembalikan access token + safe user.
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
    });

    return this.buildAuthResult(user);
  }

  /**
   * Login: validasi email + password (bcrypt compare), lalu terbitkan token.
   * Pesan error sengaja generik agar tidak membocorkan email mana yang ada.
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Akun nonaktif tidak boleh login (auth hardening).
    if (!user.isActive) {
      throw new ForbiddenException(
        'Akun Anda dinonaktifkan. Hubungi administrator.',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.buildAuthResult(user);
  }

  /**
   * Bangun access token + safe user dari entity User.
   * Memastikan password TIDAK pernah ikut di response.
   */
  private buildAuthResult(user: User): AuthResult {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
