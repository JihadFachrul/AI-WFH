import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

/**
 * Payload PATCH /api/tasks/:id (partial).
 * Mencakup update status, priority, dan assign (assignedToId) sekaligus.
 * Otorisasi per-field ditegakkan di service:
 * - hanya MANAGER/ADMIN/SUPER_ADMIN yang boleh mengubah assignedToId.
 */
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Judul task tidak boleh kosong' })
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

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
  @IsISO8601({}, { message: 'dueDate harus tanggal ISO-8601 yang valid' })
  dueDate?: string;
}
