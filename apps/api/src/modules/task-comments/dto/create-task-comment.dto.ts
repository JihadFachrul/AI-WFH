import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Payload POST /api/tasks/:taskId/comments.
 * Comment datar (tidak nested/threaded) — sesuai scope foundation.
 */
export class CreateTaskCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong' })
  @MinLength(1, { message: 'Komentar minimal 1 karakter' })
  @MaxLength(2000)
  content: string;
}
