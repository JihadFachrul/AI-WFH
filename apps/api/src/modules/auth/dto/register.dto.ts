import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Payload untuk POST /api/auth/register.
 * Divalidasi otomatis oleh ValidationPipe global.
 */
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}
