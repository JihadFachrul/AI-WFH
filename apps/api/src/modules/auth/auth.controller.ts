import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthUser } from './strategies/jwt.strategy';

/**
 * AuthController hanya menangani request/response.
 * Semua business logic didelegasikan ke AuthService.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /api/auth/register */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** POST /api/auth/login */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * GET /api/auth/me — protected route example.
   * request.user diisi oleh JwtStrategy.validate() setelah token valid.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: { user: AuthUser }): AuthUser {
    return req.user;
  }
}
