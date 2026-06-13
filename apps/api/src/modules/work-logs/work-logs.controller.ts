import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';

/**
 * Endpoint Daily Work Log di bawah task. Controller hanya request/response;
 * otorisasi & logic di service.
 */
@Controller('tasks/:taskId/work-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  /** POST /api/tasks/:taskId/work-logs */
  @Post()
  create(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() dto: CreateWorkLogDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workLogsService.create(taskId, user, dto);
  }

  /** GET /api/tasks/:taskId/work-logs */
  @Get()
  findAll(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workLogsService.findAll(taskId, user);
  }

  /** DELETE /api/tasks/:taskId/work-logs/:id */
  @Delete(':id')
  remove(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workLogsService.remove(taskId, id, user);
  }
}
