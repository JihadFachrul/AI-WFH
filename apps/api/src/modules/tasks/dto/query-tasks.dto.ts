import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query GET /api/tasks: pagination + search (title/description) + filter
 * (status, priority, assignedToId, createdById, dueDate).
 */
export class QueryTasksDto extends PaginationQueryDto {
  /** Cari pada title ATAU description (contains, case-insensitive). */
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status tidak valid' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority tidak valid' })
  priority?: TaskPriority;

  @IsOptional()
  @IsUUID('4', { message: 'assignedToId harus UUID valid' })
  assignedToId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'createdById harus UUID valid' })
  createdById?: string;

  /** Filter task yang jatuh tempo pada tanggal ini (rentang 1 hari, UTC). */
  @IsOptional()
  @IsISO8601({}, { message: 'dueDate harus tanggal ISO-8601 yang valid' })
  dueDate?: string;
}
