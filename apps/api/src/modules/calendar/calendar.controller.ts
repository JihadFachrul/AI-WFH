import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import {
  QueryCalendarDto,
  QueryMonthDto,
  QueryUpcomingDto,
} from './dto/query-calendar.dto';

/**
 * Corporate Calendar (Modul 6.2). VIEW = semua user login; CREATE = MANAGER+;
 * UPDATE = pembuat (MANAGER) / ADMIN+; DELETE = ADMIN+. Endpoint month/upcoming
 * menggabungkan Meeting (6.1) + CalendarEvent menjadi satu timeline.
 */
@Controller('calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /** GET /api/calendar/month — timeline gabungan dalam satu bulan. */
  @Get('month')
  month(@Query() query: QueryMonthDto, @CurrentUser() user: AuthUser) {
    return this.calendarService.month(query, user);
  }

  /** GET /api/calendar/upcoming — event mendatang (gabungan). */
  @Get('upcoming')
  upcoming(@Query() query: QueryUpcomingDto, @CurrentUser() user: AuthUser) {
    return this.calendarService.upcoming(query, user);
  }

  /** POST /api/calendar/events — MANAGER/ADMIN/SUPER_ADMIN. */
  @Post('events')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateCalendarEventDto, @CurrentUser() user: AuthUser) {
    return this.calendarService.create(dto, user);
  }

  /** GET /api/calendar/events — list event (semua user login). */
  @Get('events')
  findAll(@Query() query: QueryCalendarDto, @CurrentUser() user: AuthUser) {
    return this.calendarService.findAll(query, user);
  }

  /** GET /api/calendar/events/:id — detail event. */
  @Get('events/:id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.calendarService.findOne(id, user);
  }

  /** PATCH /api/calendar/events/:id — MANAGER pembuat / ADMIN / SUPER_ADMIN. */
  @Patch('events/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCalendarEventDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.calendarService.update(id, dto, user);
  }

  /** DELETE /api/calendar/events/:id — soft delete (ADMIN/SUPER_ADMIN). */
  @Delete('events/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.calendarService.remove(id, user);
  }
}
