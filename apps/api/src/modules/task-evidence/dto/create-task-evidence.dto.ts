import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Field non-file untuk POST /api/tasks/:taskId/evidence.
 * File dikirim sebagai multipart (field "file"); description opsional.
 */
export class CreateTaskEvidenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
