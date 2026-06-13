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
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { QueryMeetingsDto } from './dto/query-meetings.dto';

/**
 * Meeting Scheduler (Modul 6.1). Controller hanya request/response;
 * otorisasi & logic di service/guard.
 */
@Controller('meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  /** POST /api/meetings — MANAGER/ADMIN/SUPER_ADMIN. */
  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateMeetingDto, @CurrentUser() user: AuthUser) {
    return this.meetingsService.create(dto, user);
  }

  /** GET /api/meetings — list (scope by role). */
  @Get()
  findAll(@Query() query: QueryMeetingsDto, @CurrentUser() user: AuthUser) {
    return this.meetingsService.findAll(query, user);
  }

  /** GET /api/meetings/today — meeting hari ini (scope by role). */
  @Get('today')
  today(@CurrentUser() user: AuthUser) {
    return this.meetingsService.today(user);
  }

  /** GET /api/meetings/:id — detail (peserta/pembuat/privileged). */
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.meetingsService.findOne(id, user);
  }

  /** PATCH /api/meetings/:id — MANAGER pembuat / ADMIN / SUPER_ADMIN. */
  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateMeetingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.meetingsService.update(id, dto, user);
  }

  /** DELETE /api/meetings/:id — soft delete (ADMIN/SUPER_ADMIN). */
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.meetingsService.remove(id, user);
  }
}
