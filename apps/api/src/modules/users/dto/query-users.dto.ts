import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query untuk GET /api/users.
 * Mewarisi page & limit dari PaginationQueryDto, lalu menambah
 * search (name/email), filter role, dan filter departmentId.
 */
export class QueryUsersDto extends PaginationQueryDto {
  /** Cari pada name ATAU email (contains, case-insensitive). */
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role tidak valid' })
  role?: UserRole;

  @IsOptional()
  @IsUUID('4', { message: 'departmentId harus UUID valid' })
  departmentId?: string;
}
