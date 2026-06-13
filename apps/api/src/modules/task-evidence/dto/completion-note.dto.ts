import { IsOptional, IsString, MaxLength } from 'class-validator';

/** PATCH /api/tasks/:taskId/completion-note */
export class CompletionNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  completionNote?: string;
}
