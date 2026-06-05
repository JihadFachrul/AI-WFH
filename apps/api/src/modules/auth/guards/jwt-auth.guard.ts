import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard membungkus Passport 'jwt' strategy.
 * Pasang dengan @UseGuards(JwtAuthGuard) di route yang perlu proteksi.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
