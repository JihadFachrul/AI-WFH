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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

/**
 * Semua route butuh JWT lalu cek role (RolesGuard).
 * Otorisasi berbasis kepemilikan ditegakkan di TasksService.
 */
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /** POST /api/tasks — hanya MANAGER/ADMIN/SUPER_ADMIN. */
  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.create(dto, user);
  }

  /** GET /api/tasks — EMPLOYEE hanya task miliknya; lainnya lihat semua. */
  @Get()
  findAll(@Query() query: QueryTasksDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.findAll(query, user);
  }

  /** GET /api/tasks/:id */
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.findOne(id, user);
  }

  /** PATCH /api/tasks/:id — update/status/priority/assign (otorisasi di service). */
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  /** DELETE /api/tasks/:id — soft delete, hanya MANAGER/ADMIN/SUPER_ADMIN. */
  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.remove(id, user);
  }
}
