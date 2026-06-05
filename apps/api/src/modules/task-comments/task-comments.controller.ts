import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';

/**
 * Comment ter-nest di bawah task: /api/tasks/:taskId/comments
 * Akses task (dan otorisasinya) diverifikasi di service.
 */
@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  /** POST /api/tasks/:taskId/comments */
  @Post()
  create(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() dto: CreateTaskCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskCommentsService.create(taskId, dto, user);
  }

  /** GET /api/tasks/:taskId/comments */
  @Get()
  findAll(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Query() query: PaginationQueryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskCommentsService.findAll(taskId, query, user);
  }
}
