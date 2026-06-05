import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { NotificationsService } from './notifications.service';

/**
 * Semua route hanya butuh autentikasi; kepemilikan ditegakkan di service
 * dengan selalu memfilter userId dari token (tidak ada bypass).
 * Controller hanya handle request/response.
 */
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** GET /api/notifications — semua milik user, terbaru dahulu. */
  @Get()
  findAll(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthUser) {
    return this.notificationsService.findAll(user.id, query);
  }

  /** GET /api/notifications/unread */
  @Get('unread')
  findUnread(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthUser) {
    return this.notificationsService.findUnread(user.id, query);
  }

  /** PATCH /api/notifications/read-all — dideklarasikan sebelum :id/read. */
  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: AuthUser) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  /** PATCH /api/notifications/:id/read */
  @Patch(':id/read')
  markAsRead(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.notificationsService.markAsRead(user.id, id);
  }
}
