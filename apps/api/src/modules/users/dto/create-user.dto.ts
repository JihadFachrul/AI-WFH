import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * Payload POST /api/users (admin membuat user baru).
 * Password akan di-hash bcrypt di service.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @MaxLength(120)
  name: string;

  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsEnum(UserRole, { message: 'Role tidak valid' })
  role: UserRole;

  @IsOptional()
  @IsUUID('4', { message: 'departmentId harus UUID valid' })
  departmentId?: string;
}
