import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ReviewDecision } from '@prisma/client';

/**
 * Payload POST /api/tasks/:taskId/reviews (manager).
 * decision wajib (APPROVED/REVISION); note wajib min 10 karakter.
 */
export class CreateReviewDto {
  @IsEnum(ReviewDecision, { message: 'Keputusan review tidak valid' })
  decision: ReviewDecision;

  @IsString()
  @MinLength(10, { message: 'Catatan review minimal 10 karakter' })
  @MaxLength(2000)
  note: string;
}
