import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TaskReviewsService } from './task-reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

/**
 * Endpoint Manager Review di bawah task. Controller hanya request/response;
 * otorisasi & logic di service/guard.
 */
@Controller('tasks/:taskId')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskReviewsController {
  constructor(private readonly reviewsService: TaskReviewsService) {}

  /** POST /api/tasks/:taskId/submit-review — employee (assignee) / admin. */
  @Post('submit-review')
  @HttpCode(HttpStatus.OK)
  submitForReview(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.submitForReview(taskId, user);
  }

  /** POST /api/tasks/:taskId/reviews — manager/admin membuat review. */
  @Post('reviews')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.create(taskId, user, dto);
  }

  /** GET /api/tasks/:taskId/reviews — riwayat review. */
  @Get('reviews')
  findAll(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.findAll(taskId, user);
  }
}
