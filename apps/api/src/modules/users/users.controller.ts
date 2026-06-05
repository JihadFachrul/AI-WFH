import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Semua route butuh JWT (JwtAuthGuard) lalu dicek role (RolesGuard).
 * Controller HANYA handle request/response — otorisasi & logic di service/guard.
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** POST /api/users — buat user baru (ADMIN/SUPER_ADMIN saja). */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  /** GET /api/users/me — profil sendiri (semua role). */
  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.findMe(user.id);
  }

  /** GET /api/users — list + pagination + search + filter (MANAGER ke atas). */
  @Get()
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  /** GET /api/users/:id — privileged role atau pemilik profil. */
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.findOne(id, user);
  }

  /** PATCH /api/users/:id — ADMIN/SUPER_ADMIN siapa saja, lainnya hanya sendiri. */
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.update(id, dto, user);
  }
}
