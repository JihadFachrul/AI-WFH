import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TaskPriority } from '@prisma/client';

/**
 * Payload POST /api/tasks.
 * status sengaja tidak diterima saat create — task selalu mulai dari TODO
 * (default Prisma). priority opsional (default MEDIUM).
 */
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul task tidak boleh kosong' })
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority tidak valid' })
  priority?: TaskPriority;

  /** User yang ditugaskan (opsional). Hanya MANAGER/ADMIN yang boleh meng-assign. */
  @IsOptional()
  @IsUUID('4', { message: 'assignedToId harus UUID valid' })
  assignedToId?: string;

  /** ISO-8601, mis. "2026-06-30" atau "2026-06-30T17:00:00.000Z". */
  @IsOptional()
  @IsISO8601({}, { message: 'dueDate harus tanggal ISO-8601 yang valid' })
  dueDate?: string;
}
