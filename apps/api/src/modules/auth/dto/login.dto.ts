import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Payload untuk POST /api/auth/login.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;
}
