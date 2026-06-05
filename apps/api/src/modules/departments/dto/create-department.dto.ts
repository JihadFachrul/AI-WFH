import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Payload POST /api/departments.
 */
export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama departemen tidak boleh kosong' })
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
