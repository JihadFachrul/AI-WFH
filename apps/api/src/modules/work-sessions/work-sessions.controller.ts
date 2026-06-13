import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { WorkSessionsService } from './work-sessions.service';

/**
 * Workforce Session Tracking. Tanpa DTO (start/end tidak butuh body).
 * Controller hanya request/response; logic & otorisasi di service/guard.
 */
@Controller('work-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkSessionsController {
  constructor(private readonly workSessionsService: WorkSessionsService) {}

  /** POST /api/work-sessions/start */
  @Post('start')
  start(@CurrentUser() user: AuthUser) {
    return this.workSessionsService.start(user);
  }

  /** POST /api/work-sessions/end */
  @Post('end')
  @HttpCode(HttpStatus.OK)
  end(@CurrentUser() user: AuthUser) {
    return this.workSessionsService.end(user);
  }

  /** GET /api/work-sessions/me — sesi aktif saya. */
  @Get('me')
  mySession(@CurrentUser() user: AuthUser) {
    return this.workSessionsService.getMySession(user);
  }

  /** GET /api/work-sessions/team — presence team (MANAGER ke atas). */
  @Get('team')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  team() {
    return this.workSessionsService.getTeam();
  }
}
