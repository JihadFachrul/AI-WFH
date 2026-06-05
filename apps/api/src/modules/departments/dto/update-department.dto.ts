import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Payload PATCH /api/departments/:id. Semua field opsional (partial update).
 */
export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Nama departemen tidak boleh kosong' })
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
