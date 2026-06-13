import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Payload POST /api/tasks/:taskId/work-logs.
 * activity wajib (min 10 char); progress 0–100 opsional; blocker opsional.
 */
export class CreateWorkLogDto {
  @IsString()
  @MinLength(10, { message: 'Aktivitas minimal 10 karakter' })
  @MaxLength(1000)
  activity: string;

  @IsOptional()
  @IsInt({ message: 'Progress harus angka' })
  @Min(0, { message: 'Progress minimal 0' })
  @Max(100, { message: 'Progress maksimal 100' })
  progress?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  blocker?: string;
}
