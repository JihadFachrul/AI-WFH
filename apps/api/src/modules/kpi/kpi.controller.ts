import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { KpiService } from './kpi.service';

/**
 * KPI dihitung dinamis. Controller hanya request/response; otorisasi via guard.
 */
@Controller('kpi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  /** GET /api/kpi/me — KPI user login. */
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.kpiService.getForUser(user.id);
  }

  /** GET /api/kpi/team — KPI seluruh anggota (MANAGER ke atas). */
  @Get('team')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  team() {
    return this.kpiService.getTeam();
  }

  /** GET /api/kpi/users/:id — KPI user tertentu (MANAGER ke atas). */
  @Get('users/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  user(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.kpiService.getForUser(id);
  }
}
