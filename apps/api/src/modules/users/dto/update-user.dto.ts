import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * Field yang boleh diupdate via PATCH /api/users/:id.
 * name/email: pemilik atau admin. role/departmentId/isActive: admin saja
 * (ditegakkan di service). Password TIDAK diubah di sini (urusan auth).
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Nama tidak boleh kosong' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email tidak valid' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role tidak valid' })
  role?: UserRole;

  @IsOptional()
  @IsUUID('4', { message: 'departmentId harus UUID valid' })
  departmentId?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive harus boolean' })
  isActive?: boolean;
}
